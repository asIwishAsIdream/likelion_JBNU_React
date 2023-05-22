import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// 객체 인자를 받은 후 React 엘리먼트를 반환하므로 유효한 React 컴포넌트입니다. 이러한 컴포넌트는 JavaScript 함수이기 때문에 말 그대로 “함수 컴포넌트”


// 여기서 props가 어떻게 전달되는 것인지?
// props는 속성을 나타내는 데이터
function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
            {/* {"Hi"} */}
        </button>
    );
}



class Board extends React.Component {
    
    renderSquare(i) {
        return (
          <Square
            key={i} // 이 키값이 없으면 자꾸 에러같은게 뜬다.
            value={this.props.squares[i]}
            // Board에서 Square로 onClick={() => this.handleClick(i)}를 전달했기 때문에 Square를 클릭하면 Board의 handleClick(i)를 호출
            onClick={() => {this.props.onClick(i);}}
          />
        );
      }


    render() {
        const boardRow=[];
        let k=0;
        for (let i = 0; i < 3;i++){
        const squares = [];
            for (let j = 0; j < 3; j++){
                squares.push(this.renderSquare( i * 3 + j ));
                k++;
            }
        boardRow.push(<div key={k} className="board-row">{squares}</div>)
        }
        return (
            <div>
                <div className="board-row">
                    {boardRow}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: { // position 추가
                    x: null,
                    y: null,
                }
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                position: { //클릭 시 x, y 정의
                    x: parseInt(i / 3) + 1,
                    y: i % 3 + 1,
                }
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        // Game 컴포넌트의 render 함수를 가장 최근 기록을 사용하도록 업데이트하여 게임의 상태를 확인하고 표시하겠습니다.
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            // step은 map 함수의 콜백 함수에서 사용되는 매개변수입니다. 이 콜백 함수는 history 배열의 각 요소에 대해 실행됩니다. 따라서 step은 history 배열의 각 요소를 나타내는 객체입니다.
            console.log(typeof (step));
            const desc = move ?
                'Go to move #' + move + " X : " + step.position.x + " Y : " + step.position.y :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            if (this.state.stepNumber == 9) {
                status = "무승부"
            } else{
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
            return squares[a];
        }
    }
    return null;
}