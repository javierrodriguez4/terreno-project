import { Grid } from '@react-three/drei';
import { site } from '@/data/site';
import { Ground } from './Ground';
import { Fence } from './Fence';
import { FrontWall } from './FrontWall';
import { Gate } from './Gate';
import { Palms } from './Palms';
import { Quincho } from './Quincho';
import { Lapachos } from './Lapachos';
import { CompassNorth } from './CompassNorth';

// The shared 3D world: lights, ground and every object. Reused by the exterior and
// interior views — only the camera and controls differ between them.
export function SceneContent() {
  return (
    <>
      <color attach="background" args={['#dfe7ef']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 30, 30]} intensity={1.1} />
      <Ground />
      <Grid
        args={[site.widthM, site.depthM]}
        cellSize={1}
        cellThickness={0.5}
        sectionSize={5}
        sectionThickness={1}
        cellColor="#5f7d40"
        sectionColor="#4a6332"
        fadeDistance={140}
        position={[0, 0.01, 0]}
      />
      <Fence />
      <FrontWall />
      <Gate />
      <Palms />
      <Quincho />
      <Lapachos />
      <CompassNorth />
    </>
  );
}
