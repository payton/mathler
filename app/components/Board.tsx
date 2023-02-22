import Tile from './Tile';

type BoardProps = {
    board: string
    colors: string
}

const Board = (props: BoardProps) => {
    const renderedTiles = props.board.split('').map((char, index) => {
        if (char == "?") {
            return (
                <Tile key={`tile-${index}`} id={(index).toString()} value={null} color={props.colors.split('')[index]}></Tile>
            )
        }
        return (
            <Tile key={`tile-${index}`} id={(index).toString()} value={char} color={props.colors.split('')[index]}></Tile>
        )
    });

    return (
        <div className='flex justify-center'>
            <div className='grid grid-cols-6 grid-rows-6'>
                {renderedTiles}
            </div>
        </div>
    )
}

export default Board
