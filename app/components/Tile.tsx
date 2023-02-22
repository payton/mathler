import styles from "../styles/Home.module.css";

type TileProps = {
  id: string;
  value: string | null;
  color: string;
};

const Tile = (props: TileProps) => {
  let backgroundColor;

  switch (props.color) {
    case "Y":
      backgroundColor = "yellow";
      break;
    case "R":
      backgroundColor = "gray";
      break;
    case "G":
      backgroundColor = "green";
      break;
    default:
      backgroundColor = "white";
  }

  return (
    <div
      className={styles.tile}
      id={props.id}
      style={{ backgroundColor: backgroundColor }}
    >
      {props.value === null ? "" : props.value}
    </div>
  );
};

export default Tile;
