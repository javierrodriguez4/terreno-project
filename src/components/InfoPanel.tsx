import { site, areaM2 } from '@/data/site';

export function InfoPanel() {
  return (
    <div className="info-panel">
      <h1>Terreno — Sauce, Corrientes</h1>
      <ul>
        <li>
          <strong>{site.depthM} m</strong> de fondo &times; <strong>{site.widthM} m</strong> de ancho
        </li>
        <li>
          Superficie: <strong>{areaM2()} m&sup2;</strong>
        </li>
        <li>
          Orientaci&oacute;n: fondo al <strong>Norte</strong>
        </li>
        <li>
          Port&oacute;n doble hoja: <strong>{site.gate.widthM} m</strong> (frente/sur)
        </li>
      </ul>
      <p className="hint">Arrastr&aacute; para girar &middot; rueda para zoom</p>
    </div>
  );
}
