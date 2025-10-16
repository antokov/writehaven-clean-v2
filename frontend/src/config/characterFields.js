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
  core: [
    {
      key: 'first_name',
      label: 'Vorname',
      labelKey: 'characters.fields.basic.first_name',
      icon: BsPerson,
      path: 'basic.first_name',
      type: 'text'
    },
    {
      key: 'last_name',
      label: 'Nachname',
      labelKey: 'characters.fields.basic.last_name',
      icon: BsPerson,
      path: 'basic.last_name',
      type: 'text'
    },
  ],
  optional: [
    {
      key: 'nickname',
      label: 'Spitzname(n)',
      labelKey: 'characters.fields.basic.nickname',
      icon: BsTag,
      path: 'basic.nickname',
      type: 'text'
    },
    {
      key: 'gender',
      label: 'Geschlecht',
      labelKey: 'characters.fields.basic.gender',
      icon: BsGenderAmbiguous,
      path: 'basic.gender',
      type: 'text'
    },
    {
      key: 'birth_date',
      label: 'Geburtsdatum',
      labelKey: 'characters.fields.basic.birth_date',
      icon: BsCake,
      path: 'basic.birth_date',
      type: 'text',
      placeholder: 'z.B. 1. Wintermond / 2001-12-05',
      placeholderKey: 'characters.fields.basic.birth_date_placeholder'
    },
    {
      key: 'age',
      label: 'Alter',
      labelKey: 'characters.fields.basic.age',
      icon: BsCalendar,
      path: 'basic.age',
      type: 'text'
    },
    {
      key: 'residence',
      label: 'Wohnort',
      labelKey: 'characters.fields.basic.residence',
      icon: BsGeoAlt,
      path: 'basic.residence',
      type: 'text'
    },
    {
      key: 'nationality',
      label: 'Nationalität',
      labelKey: 'characters.fields.basic.nationality',
      icon: BsGlobe,
      path: 'basic.nationality',
      type: 'text'
    },
    {
      key: 'religion',
      label: 'Religion',
      labelKey: 'characters.fields.basic.religion',
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
      labelKey: 'characters.fields.appearance.hair_color',
      icon: BsScissors,
      path: 'appearance.hair_color',
      type: 'text'
    },
    {
      key: 'eye_color',
      label: 'Augenfarbe',
      labelKey: 'characters.fields.appearance.eye_color',
      icon: BsEye,
      path: 'appearance.eye_color',
      type: 'text'
    },
  ],
  optional: [
    {
      key: 'height',
      label: 'Größe',
      labelKey: 'characters.fields.appearance.height',
      icon: BsRulers,
      path: 'appearance.height',
      type: 'text'
    },
    {
      key: 'weight',
      label: 'Gewicht',
      labelKey: 'characters.fields.appearance.weight',
      icon: BsSpeedometer,
      path: 'appearance.weight',
      type: 'text'
    },
    {
      key: 'build',
      label: 'Statur / Körperbau',
      labelKey: 'characters.fields.appearance.build',
      icon: BsPersonBadge,
      path: 'appearance.build',
      type: 'text'
    },
    {
      key: 'skin_color',
      label: 'Hautfarbe',
      labelKey: 'characters.fields.appearance.skin_color',
      icon: BsPalette,
      path: 'appearance.skin_color',
      type: 'text'
    },
    {
      key: 'distinguishing_features',
      label: 'Besondere Merkmale',
      labelKey: 'characters.fields.appearance.distinguishing_features',
      icon: BsStars,
      path: 'appearance.distinguishing_features',
      type: 'text'
    },
    {
      key: 'clothing_style',
      label: 'Kleidungsstil',
      labelKey: 'characters.fields.appearance.clothing_style',
      icon: BsTag,
      path: 'appearance.clothing_style',
      type: 'text'
    },
    {
      key: 'accessories',
      label: 'Accessoires',
      labelKey: 'characters.fields.appearance.accessories',
      icon: BsStar,
      path: 'appearance.accessories',
      type: 'text'
    },
    {
      key: 'body_language',
      label: 'Körpersprache / Haltung',
      labelKey: 'characters.fields.appearance.body_language',
      icon: BsBodyText,
      path: 'appearance.body_language',
      type: 'text'
    },
    {
      key: 'general_impression',
      label: 'Gesamteindruck & weitere Details',
      labelKey: 'characters.fields.appearance.general_impression',
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
      labelKey: 'characters.fields.personality.traits',
      icon: BsHeart,
      path: 'personality.traits',
      type: 'textarea'
    },
    {
      key: 'strengths',
      label: 'Stärken',
      labelKey: 'characters.fields.personality.strengths',
      icon: BsShield,
      path: 'personality.strengths',
      type: 'text'
    },
    {
      key: 'weaknesses',
      label: 'Schwächen',
      labelKey: 'characters.fields.personality.weaknesses',
      icon: BsExclamationTriangle,
      path: 'personality.weaknesses',
      type: 'text'
    },
  ],
  optional: [
    {
      key: 'intelligence',
      label: 'Intelligenz',
      labelKey: 'characters.fields.personality.intelligence',
      icon: BsLightning,
      path: 'personality.intelligence',
      type: 'text'
    },
    {
      key: 'humor',
      label: 'Art des Humors',
      labelKey: 'characters.fields.personality.humor',
      icon: BsEmojiSmile,
      path: 'personality.humor',
      type: 'text'
    },
    {
      key: 'interests',
      label: 'Interessen',
      labelKey: 'characters.fields.personality.interests',
      icon: BsStar,
      path: 'personality.interests',
      type: 'text'
    },
    {
      key: 'likes',
      label: 'Geschmäcker & Vorlieben',
      labelKey: 'characters.fields.personality.likes',
      icon: BsHeart,
      path: 'personality.likes',
      type: 'text'
    },
    {
      key: 'dislikes',
      label: 'Abneigungen',
      labelKey: 'characters.fields.personality.dislikes',
      icon: BsHandThumbsDown,
      path: 'personality.dislikes',
      type: 'text'
    },
    {
      key: 'morals',
      label: 'Moralvorstellungen & innere Haltung',
      labelKey: 'characters.fields.personality.morals',
      icon: BsCompass,
      path: 'personality.morals',
      type: 'text'
    },
    {
      key: 'fears',
      label: 'Phobien & Ängste',
      labelKey: 'characters.fields.personality.fears',
      icon: BsExclamationTriangle,
      path: 'personality.fears',
      type: 'text'
    },
    {
      key: 'goals_motivation',
      label: 'Ziele & Motivation',
      labelKey: 'characters.fields.personality.goals_motivation',
      icon: BsFlag,
      path: 'personality.goals_motivation',
      type: 'text'
    },
    {
      key: 'unresolved_problems',
      label: 'Ungelöste Probleme',
      labelKey: 'characters.fields.personality.unresolved_problems',
      icon: BsQuestionCircle,
      path: 'personality.unresolved_problems',
      type: 'text'
    },
    {
      key: 'inner_conflicts',
      label: 'Innere Konflikte',
      labelKey: 'characters.fields.personality.inner_conflicts',
      icon: BsExclamationTriangle,
      path: 'personality.inner_conflicts',
      type: 'text'
    },
    {
      key: 'wishes_dreams',
      label: '(Geheime) Wünsche & Träume',
      labelKey: 'characters.fields.personality.wishes_dreams',
      icon: BsStar,
      path: 'personality.wishes_dreams',
      type: 'text'
    },
    {
      key: 'patterns_in_situations',
      label: 'Wiederkehrende Verhaltensweisen',
      labelKey: 'characters.fields.personality.patterns_in_situations',
      icon: BsClock,
      path: 'personality.patterns_in_situations',
      type: 'text'
    },
    {
      key: 'traumas',
      label: 'Traumata',
      labelKey: 'characters.fields.personality.traumas',
      icon: BsExclamationTriangle,
      path: 'personality.traumas',
      type: 'text'
    },
    {
      key: 'setbacks',
      label: 'Schmerzliche Rückschläge & Erlebnisse',
      labelKey: 'characters.fields.personality.setbacks',
      icon: BsHandThumbsDown,
      path: 'personality.setbacks',
      type: 'text'
    },
    {
      key: 'experiences',
      label: 'Bedeutungsvolle Erfahrungen',
      labelKey: 'characters.fields.personality.experiences',
      icon: BsStar,
      path: 'personality.experiences',
      type: 'text'
    },
    {
      key: 'view_on_life',
      label: 'Standpunkt ggü. Leben',
      labelKey: 'characters.fields.personality.view_on_life',
      icon: BsCompass,
      path: 'personality.view_on_life',
      type: 'text'
    },
    {
      key: 'view_on_death',
      label: 'Standpunkt ggü. Tod',
      labelKey: 'characters.fields.personality.view_on_death',
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
      labelKey: 'characters.fields.background.family_background',
      icon: BsPerson,
      path: 'relations.family_background',
      type: 'textarea'
    },
  ],
  optional: [
    {
      key: 'childhood',
      label: 'Kindheit',
      labelKey: 'characters.fields.background.childhood',
      icon: BsCake,
      path: 'relations.childhood',
      type: 'textarea'
    },
    {
      key: 'education',
      label: 'Ausbildung / Bildung',
      labelKey: 'characters.fields.background.education',
      icon: BsBook,
      path: 'relations.education',
      type: 'text'
    },
    {
      key: 'occupation',
      label: 'Beruf / Tätigkeit',
      labelKey: 'characters.fields.background.occupation',
      icon: BsBullseye,
      path: 'relations.occupation',
      type: 'text'
    },
    {
      key: 'social_status',
      label: 'Sozialer Status',
      labelKey: 'characters.fields.background.social_status',
      icon: BsStar,
      path: 'relations.social_status',
      type: 'text'
    },
  ]
};
