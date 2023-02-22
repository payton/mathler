import styles from "../styles/Mathler.module.css";

type InputTileProps = {
  value: string;
  callback: () => void;
  disabled: boolean;
};

const InputTile = (props: InputTileProps) => {
  return (
    <button
      className={styles.inputTile}
      id={props.value.toString()}
      onClick={props.callback}
      disabled={props.disabled}
    >
      {props.value}
    </button>
  );
};

export default InputTile;
