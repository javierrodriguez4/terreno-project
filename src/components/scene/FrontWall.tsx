import { site } from '@/data/site';

const HEIGHT = 1.5; // post height, meters
const POST = 0.12; // post side, meters
const BOARD_H = 0.15; // each board height
const BOARD_T = 0.04; // board thickness (depth)
const BOARD_GAP = 0.03; // gap between boards
const BOARD_BOTTOM = 0.1;
const BOARD_TOP = 1.4;

const WOOD = '#8a5a2b';
const POST_WOOD = '#6b4423';

function Post({ x }: { x: number }) {
  return (
    <mesh position={[x, HEIGHT / 2, 0]}>
      <boxGeometry args={[POST, HEIGHT, POST]} />
      <meshStandardMaterial color={POST_WOOD} />
    </mesh>
  );
}

// Horizontal boards screwed between two posts (gate post and corner post).
function BoardWall({ fromX, toX }: { fromX: number; toX: number }) {
  const len = Math.abs(toX - fromX);
  const cx = (fromX + toX) / 2;
  const step = BOARD_H + BOARD_GAP;
  const count = Math.floor((BOARD_TOP - BOARD_BOTTOM) / step) + 1;
  const boards = [];
  for (let i = 0; i < count; i++) {
    const y = BOARD_BOTTOM + i * step + BOARD_H / 2;
    boards.push(
      <mesh key={i} position={[cx, y, 0]}>
        <boxGeometry args={[len, BOARD_H, BOARD_T]} />
        <meshStandardMaterial color={WOOD} />
      </mesh>,
    );
  }
  return <group>{boards}</group>;
}

// Front (south) edge: corner posts, gate posts, and horizontal wood boards on each
// side between the gate post and the corner post. The gate itself sits in the middle.
export function FrontWall() {
  const w = site.widthM / 2;
  const d = site.depthM / 2;
  const g = site.gate.widthM / 2;
  return (
    <group position={[0, 0, -d]}>
      {/* corner posts */}
      <Post x={-w} />
      <Post x={w} />
      {/* gate posts */}
      <Post x={-g} />
      <Post x={g} />
      {/* horizontal boards on each side */}
      <BoardWall fromX={-w + POST / 2} toX={-g - POST / 2} />
      <BoardWall fromX={g + POST / 2} toX={w - POST / 2} />
    </group>
  );
}
