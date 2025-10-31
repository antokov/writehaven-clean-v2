# backend/nlp_service.py
"""
NLP Service for entity extraction using spaCy.
Supports German and English models for PERSON and LOC recognition.

NOTE: spaCy is optional. If not installed, NLP features will be disabled.
"""
from typing import List, Dict, Optional
from rapidfuzz import fuzz

# Try to import spaCy (optional dependency)
try:
    import spacy
    SPACY_AVAILABLE = True

    # Try to load spaCy models
    try:
        nlp_de = spacy.load("de_core_news_sm")
        nlp_en = spacy.load("en_core_web_sm")
        SPACY_MODELS_AVAILABLE = True
    except OSError:
        print("⚠️  WARNING: spaCy models not found. NLP features will be disabled.")
        print("  To enable NLP, install models:")
        print("  python -m pip install https://github.com/explosion/spacy-models/releases/download/de_core_news_sm-3.7.0/de_core_news_sm-3.7.0-py3-none-any.whl")
        print("  python -m pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.0/en_core_web_sm-3.7.0-py3-none-any.whl")
        nlp_de = None
        nlp_en = None
        SPACY_MODELS_AVAILABLE = False
except ImportError:
    print("⚠️  WARNING: spaCy not installed. NLP features will be disabled.")
    print("  To enable NLP, install: pip install spacy")
    SPACY_AVAILABLE = False
    SPACY_MODELS_AVAILABLE = False
    nlp_de = None
    nlp_en = None


def is_likely_name(text: str, token=None) -> bool:
    """
    Check if text is likely a proper name.

    Args:
        text: The entity text
        token: Optional spaCy token for POS tag checking
    """
    if not text or len(text) < 2:
        return False

    # Must start with capital letter
    if not text[0].isupper():
        return False

    # If we have POS tag info, check if it's a proper noun
    # This helps filter out German common nouns (NOUN) from proper names (PROPN)
    if token and hasattr(token, 'pos_'):
        if token.pos_ not in ('PROPN', 'X'):  # PROPN = proper noun, X = unknown
            return False

    # Check if it's a common false positive
    false_positives = {
        # German articles, pronouns, etc.
        'Der', 'Die', 'Das', 'Den', 'Dem', 'Des', 'Ein', 'Eine', 'Einen', 'Einem',
        'Einer', 'Sein', 'Seine', 'Ihr', 'Ihre', 'Mein', 'Dein', 'Unser',
        'Sie', 'Er', 'Es', 'Ich', 'Du', 'Wir',
        # English
        'The', 'A', 'An', 'He', 'She', 'It', 'I', 'You', 'We', 'They',
        'His', 'Her', 'My', 'Your', 'Our', 'Their',
        # Common German words that are not names
        'Zeit', 'Ort', 'Tag', 'Nacht', 'Morgen', 'Abend',
        'Zeit', 'Jahr', 'Monat', 'Woche', 'Stunde', 'Minute',
        'Mann', 'Frau', 'Kind', 'Leute', 'Menschen',
        'Haus', 'Tür', 'Fenster', 'Wand', 'Boden', 'Decke',
        'Kopf', 'Hand', 'Auge', 'Ohr', 'Mund', 'Nase',
        'Arm', 'Bein', 'Fuß', 'Finger', 'Schulter', 'Schultern',
        'Herz', 'Seele', 'Geist', 'Körper',
        'Weg', 'Straße', 'Platz', 'Stadt', 'Dorf', 'Land',
        'Welt', 'Leben', 'Tod', 'Liebe', 'Hass',
        # English common words
        'Time', 'Place', 'Day', 'Night', 'Morning', 'Evening',
        'Year', 'Month', 'Week', 'Hour', 'Minute',
        'Man', 'Woman', 'Child', 'People',
        'House', 'Door', 'Window', 'Wall', 'Floor', 'Ceiling',
        'Head', 'Hand', 'Eye', 'Ear', 'Mouth', 'Nose',
        'Arm', 'Leg', 'Foot', 'Finger', 'Shoulder', 'Shoulders',
        'Heart', 'Soul', 'Spirit', 'Body',
        'Way', 'Street', 'Square', 'City', 'Village', 'Country',
        'World', 'Life', 'Death', 'Love', 'Hate'
    }

    if text in false_positives:
        return False

    # Single letter is not a name
    if len(text) == 1:
        return False

    return True


def extract_entities(text: str, language: str = "en", ignored_words: List[str] = None) -> List[Dict]:
    """
    Extract PERSON and LOC entities from text using spaCy.

    Args:
        text: The text to analyze
        language: Language code ("en" or "de")
        ignored_words: List of words to ignore (case-insensitive)

    Returns:
        List of entity dictionaries with keys:
        - text: The entity text
        - label: Entity type (PERSON or LOC)
        - start: Character offset start
        - end: Character offset end
    """
    # Return empty list if spaCy is not available
    if not SPACY_AVAILABLE or not SPACY_MODELS_AVAILABLE:
        return []

    if not text or not text.strip():
        return []

    # Create lowercase set for fast lookup
    ignored_set = set(w.lower() for w in (ignored_words or []))

    # Select appropriate model
    nlp = nlp_de if language == "de" else nlp_en

    # Safety check
    if nlp is None:
        return []

    # Process text
    doc = nlp(text)

    # Extract entities
    entities = []
    seen_positions = set()  # Prevent duplicates

    for ent in doc.ents:
        # Filter for PERSON and LOC only
        if ent.label_ in ("PERSON", "PER", "LOC", "GPE"):
            # Skip if in ignored list (case-insensitive)
            if ent.text.lower() in ignored_set:
                continue

            # Skip if not likely a name - pass first token for POS checking
            # Multi-word entities: check if first word is proper noun
            first_token = ent[0] if len(ent) > 0 else None
            if not is_likely_name(ent.text, first_token):
                continue

            # Normalize label
            label = "PERSON" if ent.label_ in ("PERSON", "PER") else "LOC"

            # Prevent duplicate overlapping entities
            pos_key = (ent.start_char, ent.end_char)
            if pos_key in seen_positions:
                continue

            seen_positions.add(pos_key)

            entities.append({
                "text": ent.text,
                "label": label,
                "start": ent.start_char,
                "end": ent.end_char
            })

    return entities


def fuzzy_match_entities(
    mention_text: str,
    existing_names: List[str],
    threshold: int = 85
) -> Optional[Dict]:
    """
    Find fuzzy matches for a mention against existing entity names.
    Handles partial name matching (e.g., "Alaric" matches "Alaric Thorne").

    Args:
        mention_text: The text to match
        existing_names: List of existing entity names
        threshold: Minimum similarity score (0-100)

    Returns:
        Dict with 'name' and 'score' if match found, else None
    """
    if not mention_text or not existing_names:
        return None

    best_match = None
    best_score = 0

    mention_lower = mention_text.lower().strip()

    for name in existing_names:
        name_lower = name.lower().strip()

        # Exact match
        if mention_lower == name_lower:
            return {"name": name, "score": 100}

        # Check if mention is part of the full name (e.g., "Alaric" in "Alaric Thorne")
        name_parts = name_lower.split()
        mention_parts = mention_lower.split()

        # If mention is a single word and matches any part of the full name
        if len(mention_parts) == 1:
            for part in name_parts:
                if mention_lower == part:
                    return {"name": name, "score": 95}
                # Also check similarity of each part
                part_score = fuzz.ratio(mention_lower, part)
                if part_score >= threshold and part_score > best_score:
                    best_score = part_score
                    best_match = name

        # Use token_sort_ratio for multi-word matching
        token_score = fuzz.token_sort_ratio(mention_lower, name_lower)
        if token_score >= threshold and token_score > best_score:
            best_score = token_score
            best_match = name

        # Also try partial ratio (substring matching)
        partial_score = fuzz.partial_ratio(mention_lower, name_lower)
        if partial_score >= threshold and partial_score > best_score:
            best_score = partial_score
            best_match = name

    if best_match:
        return {
            "name": best_match,
            "score": best_score
        }

    return None


def analyze_paragraph(
    text: str,
    language: str = "en",
    existing_characters: Optional[List[Dict]] = None,
    existing_locations: Optional[List[Dict]] = None,
    ignored_words: Optional[List[str]] = None
) -> Dict:
    """
    Analyze a paragraph and extract entities with fuzzy match suggestions.

    Args:
        text: The paragraph text
        language: Language code ("en" or "de")
        existing_characters: List of existing character dicts with 'id' and 'name'
        existing_locations: List of existing location dicts with 'id' and 'title'
        ignored_words: List of words to ignore (case-insensitive)

    Returns:
        Dict with:
        - entities: List of extracted entities
        - suggestions: List of fuzzy match suggestions
    """
    entities = extract_entities(text, language, ignored_words)
    suggestions = []

    # Prepare name lists for fuzzy matching
    character_names = [c["name"] for c in (existing_characters or [])]
    location_names = [loc["title"] for loc in (existing_locations or [])]

    # Find suggestions for each entity
    for ent in entities:
        match = None
        entity_id = None
        entity_name = None

        if ent["label"] == "PERSON":
            match = fuzzy_match_entities(ent["text"], character_names)
            if match:
                # Find the matching character ID
                for char in existing_characters:
                    if char["name"] == match["name"]:
                        entity_id = char["id"]
                        entity_name = char["name"]
                        break

        elif ent["label"] == "LOC":
            match = fuzzy_match_entities(ent["text"], location_names)
            if match:
                # Find the matching location ID
                for loc in existing_locations:
                    if loc["title"] == match["name"]:
                        entity_id = loc["id"]
                        entity_name = loc["title"]
                        break

        if match:
            suggestions.append({
                "mention_text": ent["text"],
                "match_name": entity_name,
                "entity_id": entity_id,
                "entity_type": ent["label"],
                "score": match["score"],
                "start": ent["start"],
                "end": ent["end"]
            })

    return {
        "entities": entities,
        "suggestions": suggestions
    }
