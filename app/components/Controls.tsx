import InputTile from "./InputTile";

type ControlsProps = {
  enterCallback: () => void;
  deleteCallback: () => void;
  inputCallback: (i: string) => void;
  restartCallback: () => void;
  disabled: boolean;
};

const Controls = (props: ControlsProps) => {
  const renderedNumberInputs = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ].map((i) => {
    return (
      <InputTile
        key={`number-input-${i}`}
        value={i}
        callback={() => props.inputCallback(i)}
        disabled={props.disabled}
      ></InputTile>
    );
  });

  const renderedOperators = ["+", "-", "*", "/"].map((i) => {
    return (
      <InputTile
        key={`operator-input-${i}`}
        value={i}
        callback={() => props.inputCallback(i)}
        disabled={props.disabled}
      ></InputTile>
    );
  });

  return (
    <div className="grid grid-rows-2 my-4">
      <div className="flex row-span-1 justify-center">
        {renderedNumberInputs}
      </div>
      <div className="flex row-span-1 justify-center">
        <InputTile
          value={"Restart"}
          callback={() => props.restartCallback()}
          disabled={!props.disabled}
        ></InputTile>
        <InputTile
          value={"Enter"}
          callback={() => props.enterCallback()}
          disabled={props.disabled}
        ></InputTile>
        {renderedOperators}
        <InputTile
          value={"Delete"}
          callback={() => props.deleteCallback()}
          disabled={props.disabled}
        ></InputTile>
      </div>
    </div>
  );
};

export default Controls;
