import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let myStyle = {};
    if (props.win === true) {
        myStyle = {
            backgroundColor: "green"
        }
    }

    return(
        <button
            className="square"
            style={myStyle}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
    
}

class Board extends React.Component {

    renderSquare(i) {
        let win;
        if (this.props.win && this.props.win.includes(i)) {
            win = true;
        } else {
            win = false;
        }

        return (
            <Square
                win={win}
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />);
        
    }

    createSquares() {
        var rows = [];
        for (var i = 0; i < 3; i++) {
            var squares = [];
            for (var j = 0; j < 3; j++) {
                squares.push(this.renderSquare(3 * i + j));
            }
            rows.push(<div key={i} className="board-row">{squares}</div>)
        }
        return rows;
    }

    render() {
        return(
            <div> 
                {this.createSquares()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            stepLocations: [],
            reverse: false,
        }
        this.handleReverse = this.handleReverse.bind(this);
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const stepLocations = this.state.stepLocations.slice(0, this.state.stepNumber);
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            stepLocations: stepLocations.concat(i),
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    handleReverse() {
        this.setState({ reverse: !this.state.reverse });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const location = this.state.stepLocations;
        const xy = ["1, 1", "1, 2", "1, 3",
                    "2, 1", "2, 2", "2, 3",
                    "3, 1", "3, 2", "3, 3"]
        var moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #'
                + move
                + " x, y ("
                + xy[location[move - 1]]
                + ")":
                'Go to game start';
            if (move === history.length - 1) {
                return (
                    <li key={move}>
                        <button
                        style={{fontWeight: "bold"}}
                        onClick={() => this.jumpTo(move)}>
                            {desc}
                        </button>
                    </li>
                );
            } else {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            {desc}
                        </button>
                    </li>
                );
            }
                
        });
        let status;
        let winningSquares;
        if (winner) {
            status = 'Winner: ' + winner.win;
            winningSquares = winner.winSquares;
            /* console.log(winningSquares); */
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        this.state.reverse
        ? moves = <ol reversed>{moves.reverse()}</ol>
        : moves = <ol>{moves}</ol>

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        win={winningSquares}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{moves}</div>
                </div>
                <div>
                    <button onClick={this.handleReverse}>Reverse</button>
                </div>
            </div>
        )
    }
}

ReactDOM.render (
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        const result = {
            win: squares[a],
            winSquares: [a, b, c],
        }
        return result;
      }
    }
    return null;
  }