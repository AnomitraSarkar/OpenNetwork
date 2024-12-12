import { useRef, useLayoutEffect, useState } from "react";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const Sphere = ({ position, size, color }) => {
  const ref = useRef();

  const [Hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const speed = Hovered ? 1 : 0.2;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x -= delta * 0;
  });

  return (
    <mesh
      position={position}
      ref={ref}
      onPointerEnter={(event) => (event.stopPropagation(), setHovered(true))}
      onPointerLeave={() => setHovered(false)}
    >
      <sphereGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Cube = ({ position, size, color }) => {
  const ref = useRef();

  useFrame((state, delta) => {
    ref.current.rotation.x += delta;
    ref.current.rotation.y -= delta;
    // ref.current.position.z = Math.sin(state.clock.elapsedTime) * 3;
  });

  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

function Line({ start, end }) {
  const ref = useRef();
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints(
      [start, end].map((point) => new THREE.Vector3(...point))
    );
  }, [start, end]);
  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="hotpink" />
    </line>
  );
}

function drawConnections(start, end) {
  let res = [];
  start.forEach((init) => {
    end.forEach((final) => {
      res.push([init, final]);
    });
  });
  return res;
}

function multiply(mat1, mat2) {
  let i, j, k;
  let res = [];
  for (i = 0; i < mat1.length; i++) {
    res[i] = [];
    for (j = 0; j < mat2[0].length; j++) {
      res[i][j] = 0;
      for (k = 0; k < mat2.length; k++) {
        res[i][j] += mat1[i][k] * mat2[k][j];
      }
    }
  }
  return res;
}

const App = ({ input }) => {
  let weights = [
    [30, 5, 10, 15, 20],
    [10, 30, 10, 20, 4],
    [6, 30, 4, 10, 15],
  ];

  let res = multiply(weights, input);

  let lines = [[], []]; // one for input place another for output

  return (
    <div className="canvas-container">
      <Canvas className="canvaselem">
        <directionalLight position={[0, 0, 2]} />
        <ambientLight />
        {input.map((e, index) => {
          lines[0].push([-5+2, 1.5 * (index - 2), 0]);
          return (
            <Cube
              position={[-5+2, 1.5 * (index - 2), 0]}
              size={[0.5, 0.5, 0.5]}
              color={`rgba(${20 * e},${30 * e},${40 * e})`}
            />
          );
        })}

        {res.map((e, index) => {
          lines[1].push([1+2, 2 * (index - 1), 0]);
          return (
            <Sphere
              position={[1+2, 2 * (index - 1), 0]}
              size={[0.5, 32, 16]}
              color={`rgb(${e - 200},${e - 20},${e - 100})`}
            />
          );
        })}

        {drawConnections(lines[0], lines[1]).map((coord) => (
          <Line start={coord[0]} end={coord[1]} />
        ))}

        {/* <Line start={[0, 0, 0]} end={[1, 0, 0]} /> */}

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
};

export default App;
