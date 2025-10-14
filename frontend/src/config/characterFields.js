/**
 * Character Field Configurations with Icons
 * Definiert alle verfügbaren Felder für Charakterprofile
 */

import {
  BsPerson, BsCalendar, BsGenderAmbiguous, BsCake, BsGeoAlt,
  BsGlobe, BsPeace, BsTag,
  BsRulers, BsSpeedometer, BsPalette, BsEye, BsScissors,
  BsPersonBadge, BsStars, BsBodyText,
  BsHeart, BsShield, BsLightning, BsEmojiSmile, BsBook, BsStar,
  BsHandThumbsDown, BsCompass, BsExclamationTriangle, BsFlag,
  BsQuestionCircle, BsLock, BsBullseye, BsClock
} from 'react-icons/bs';

// Grunddaten-Felder
export const BASIC_FIELDS = {
  // Kern-Felder (immer sichtbar)
  core: [
    {
      key: 'first_name',
      label: 'Vorname',
      icon: BsPerson,
      path: 'basic.first_name',
      type: 'text'
    },
    {
      key: 'last_name',
      label: 'Nachname',
      icon: BsPerson,
      path: 'basic.last_name',
      type: 'text'
    },
  ],
  // Optional hinzufügbare Felder
  optional: [
    {
      key: 'nickname',
      label: 'Spitzname(n)',
      icon: BsTag,
      path: 'basic.nickname',
      type: 'text'
    },
    {
      key: 'gender',
      label: 'Geschlecht',
      icon: BsGenderAmbiguous,
      path: 'basic.gender',
      type: 'text'
    },
    {
      key: 'birth_date',
      label: 'Geburtsdatum',
      icon: BsCake,
      path: 'basic.birth_date',
      type: 'text',
      placeholder: 'z.B. 1. Wintermond / 2001-12-05'
    },
    {
      key: 'age',
      label: 'Alter',
      icon: BsCalendar,
      path: 'basic.age',
      type: 'text'
    },
    {
      key: 'residence',
      label: 'Wohnort',
      icon: BsGeoAlt,
      path: 'basic.residence',
      type: 'text'
    },
    {
      key: 'nationality',
      label: 'Nationalität',
      icon: BsGlobe,
      path: 'basic.nationality',
      type: 'text'
    },
    {
      key: 'religion',
      label: 'Religion',
      icon: BsPeace,
      path: 'basic.religion',
      type: 'text'
    },
  ]
};

// Äußeres-Felder
export const APPEARANCE_FIELDS = {
  core: [
    {
      key: 'hair_color',
      label: 'Haarfarbe',
      icon: BsScissors,
      path: 'appearance.hair_color',
      type: 'text'
    },
    {
      key: 'eye_color',
      label: 'Augenfarbe',
      icon: BsEye,
      path: 'appearance.eye_color',
      type: 'text'
    },
  ],
  optional: [
    {
      key: 'height',
      label: 'Größe',
      icon: BsRulers,
      path: 'appearance.height',
      type: 'text'
    },
    {
      key: 'weight',
      label: 'Gewicht',
      icon: BsSpeedometer,
      path: 'appearance.weight',
      type: 'text'
    },
    {
      key: 'build',
      label: 'Statur / Körperbau',
      icon: BsPersonBadge,
      path: 'appearance.build',
      type: 'text'
    },
    {
      key: 'skin_color',
      label: 'Hautfarbe',
      icon: BsPalette,
      path: 'appearance.skin_color',
      type: 'text'
    },
    {
      key: 'distinguishing_features',
      label: 'Besondere Merkmale',
      icon: BsStars,
      path: 'appearance.distinguishing_features',
      type: 'text'
    },
    {
      key: 'clothing_style',
      label: 'Kleidungsstil',
      icon: BsTag,
      path: 'appearance.clothing_style',
      type: 'text'
    },
    {
      key: 'accessories',
      label: 'Accessoires',
      icon: BsStar,
      path: 'appearance.accessories',
      type: 'text'
    },
    {
      key: 'body_language',
      label: 'Körpersprache / Haltung',
      icon: BsBodyText,
      path: 'appearance.body_language',
      type: 'text'
    },
    {
      key: 'general_impression',
      label: 'Gesamteindruck & weitere Details',
      icon: BsBook,
      path: 'appearance.general_impression',
      type: 'textarea'
    },
  ]
};

// Persönlichkeit-Felder
export const PERSONALITY_FIELDS = {
  core: [
    {
      key: 'traits',
      label: 'Hervorstechende Charakterzüge (positiv & negativ)',
      icon: BsHeart,
      path: 'personality.traits',
      type: 'textarea'
    },
    {
      key: 'strengths',
      label: 'Stärken',
      icon: BsShield,
      path: 'personality.strengths',
      type: 'text'
    },
    {
      key: 'weaknesses',
      label: 'Schwächen',
      icon: BsExclamationTriangle,
      path: 'personality.weaknesses',
      type: 'text'
    },
  ],
  optional: [
    {
      key: 'intelligence',
      label: 'Intelligenz',
      icon: BsLightning,
      path: 'personality.intelligence',
      type: 'text'
    },
    {
      key: 'humor',
      label: 'Art des Humors',
      icon: BsEmojiSmile,
      path: 'personality.humor',
      type: 'text'
    },
    {
      key: 'interests',
      label: 'Interessen',
      icon: BsStar,
      path: 'personality.interests',
      type: 'text'
    },
    {
      key: 'likes',
      label: 'Geschmäcker & Vorlieben',
      icon: BsHeart,
      path: 'personality.likes',
      type: 'text'
    },
    {
      key: 'dislikes',
      label: 'Abneigungen',
      icon: BsHandThumbsDown,
      path: 'personality.dislikes',
      type: 'text'
    },
    {
      key: 'morals',
      label: 'Moralvorstellungen & innere Haltung',
      icon: BsCompass,
      path: 'personality.morals',
      type: 'text'
    },
    {
      key: 'fears',
      label: 'Phobien & Ängste',
      icon: BsExclamationTriangle,
      path: 'personality.fears',
      type: 'text'
    },
    {
      key: 'goals_motivation',
      label: 'Ziele & Motivation',
      icon: BsFlag,
      path: 'personality.goals_motivation',
      type: 'text'
    },
    {
      key: 'unresolved_problems',
      label: 'Ungelöste Probleme',
      icon: BsQuestionCircle,
      path: 'personality.unresolved_problems',
      type: 'text'
    },
    {
      key: 'inner_conflicts',
      label: 'Innere Konflikte',
      icon: BsExclamationTriangle,
      path: 'personality.inner_conflicts',
      type: 'text'
    },
    {
      key: 'wishes_dreams',
      label: '(Geheime) Wünsche & Träume',
      icon: BsStar,
      path: 'personality.wishes_dreams',
      type: 'text'
    },
    {
      key: 'patterns_in_situations',
      label: 'Wiederkehrende Verhaltensweisen',
      icon: BsClock,
      path: 'personality.patterns_in_situations',
      type: 'text'
    },
    {
      key: 'traumas',
      label: 'Traumata',
      icon: BsExclamationTriangle,
      path: 'personality.traumas',
      type: 'text'
    },
    {
      key: 'setbacks',
      label: 'Schmerzliche Rückschläge & Erlebnisse',
      icon: BsHandThumbsDown,
      path: 'personality.setbacks',
      type: 'text'
    },
    {
      key: 'experiences',
      label: 'Bedeutungsvolle Erfahrungen',
      icon: BsStar,
      path: 'personality.experiences',
      type: 'text'
    },
    {
      key: 'view_on_life',
      label: 'Standpunkt ggü. Leben',
      icon: BsCompass,
      path: 'personality.view_on_life',
      type: 'text'
    },
    {
      key: 'view_on_death',
      label: 'Standpunkt ggü. Tod',
      icon: BsLock,
      path: 'personality.view_on_death',
      type: 'text'
    },
  ]
};

// Hintergrund-Felder
export const BACKGROUND_FIELDS = {
  core: [
    {
      key: 'family_background',
      label: 'Familienhintergrund',
      icon: BsPerson,
      path: 'relations.family_background',
      type: 'textarea'
    },
  ],
  optional: [
    {
      key: 'childhood',
      label: 'Kindheit',
      icon: BsCake,
      path: 'relations.childhood',
      type: 'textarea'
    },
    {
      key: 'education',
      label: 'Ausbildung / Bildung',
      icon: BsBook,
      path: 'relations.education',
      type: 'text'
    },
    {
      key: 'occupation',
      label: 'Beruf / Tätigkeit',
      icon: BsBullseye,
      path: 'relations.occupation',
      type: 'text'
    },
    {
      key: 'social_status',
      label: 'Sozialer Status',
      icon: BsStar,
      path: 'relations.social_status',
      type: 'text'
    },
  ]
};
