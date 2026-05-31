import React from 'react';

function BrandLogo({ compact = false }) {
  return (
    <div className={compact ? 'brand-logo compact-logo' : 'brand-logo'} aria-label="LaserOps">
      <div className="brand-symbol" aria-hidden="true">
        <span className="arc arc-one" />
        <span className="arc arc-two" />
        <span className="arc arc-three" />
        <span className="arc arc-four" />
        <span className="laser-dot" />
      </div>
      <div>
        <strong>LaserOps</strong>
        {!compact && <small>arena, diversão e acesso seguro</small>}
      </div>
    </div>
  );
}

export default BrandLogo;
