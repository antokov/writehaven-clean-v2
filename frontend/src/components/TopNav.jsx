import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TopNav(){
  const { id } = useParams();
  const { t } = useTranslation();

  if (!id) return null; // nur auf Projektseiten anzeigen
  const base = `/app/project/${id}`;

  return (
    <div className="tabs">
      <div className="tabs-center">
        <NavLink end to={base} className="tab">{t('navigation.writing')}</NavLink>
        <NavLink to={`${base}/characters`} className="tab">{t('navigation.characters')}</NavLink>
        <NavLink to={`${base}/world`} className="tab">{t('navigation.world')}</NavLink>
        <NavLink to={`${base}/map`} className="tab">{t('navigation.map')}</NavLink>
        <NavLink to={`${base}/export`} className="tab">{t('navigation.export')}</NavLink>
        <NavLink to={`${base}/settings`} className="tab">{t('navigation.projectSettings')}</NavLink>
      </div>
    </div>
  );
}
