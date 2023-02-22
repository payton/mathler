import styles from "../styles/Mathler.module.css";

type InputTileProps = {
  value: string;
  callback: () => void;
};

const InputTile = (props: InputTileProps) => {
  return (
    <button
      className={styles.inputTile}
      id={props.value.toString()}
      onClick={props.callback}
    >
      {props.value}
    </button>
  );
};

export default InputTile;
