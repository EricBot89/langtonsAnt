import React from 'react';
import './App.css';
const cellType = ["whiteCell",
                  "greenCell",
                  "redCell",
                  "blueCell",
                  "blackCell",
                  "lightgreyCell",
                  "lightgreenCell",
                  "lightredCell",
                  "lightblueCell"
                ]

const initalizeBoard = () => {
  const initBoard = [];

  for(let i = 0; i<50;i++){
    const newrow = [];
    for(let j = 0; j<50; j++){
      newrow.push(0);
    }
    initBoard.push(newrow);
  }
  return initBoard;
}

const headingMap = {
  R: 3,
  L: 1,
  U: 2,
}

class App extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      board: initalizeBoard(),
      antLoc: { x: 25, y: 25 },
      antHeading: 0,
      rule: {string: "LR", parsed: {ruleArr: [1,3], ruleLength: 2}},
      animating: false,
    }
    this.breakCode = 0;
    this.antFrame = this.antFrame.bind(this);
    this.ruleControl = this.ruleControl.bind(this);
  }

  antFrame(rule){

      const { ruleArr,ruleLength }=this.state.rule.parsed;
      let { x , y } = this.state.antLoc;
      let newBoard = this.state.board;
      let heading = this.state.antHeading;
      switch(heading){
        case 0:
          x += 1;    
          break;
        case 1:
          y += 1;
          break;
        case 2:
          x -= 1;
          break;
        case 3:
          y -= 1;
          break;
        default:
          console.log("something went wrong with the heading somehow");
          return;
      }
      heading = (heading + ruleArr[newBoard[x][y]])%4;
      newBoard[x][y] = (newBoard[x][y] + 1)%ruleLength;
      this.setState({
        board: newBoard,
        antLoc: {x,y},
        antHeading: heading,
      })
    
  }

  animateAnt(){
    const valid = this.state.rule.parsed;
    if(valid){
      if(this.state.animating){
        clearInterval(this.breakCode);
        this.setState({animating: false});
        return;
      } else {this.setState({animating: true})}
    
      this.breakCode = setInterval(this.antFrame, 50);
    }

  }

  parseRule(stringRule){
    const ruleArr = stringRule.split("").map(e => headingMap[e]);
    if(ruleArr.includes(undefined)){return false}
    const ruleLength = ruleArr.length;
    return {ruleArr, ruleLength}
  }

  ruleControl(e){
    if(!this.state.animating){
      const newRule = e.target.value;
      const validatedRule = this.parseRule(newRule);
      this.setState({
        board: initalizeBoard(),
        antLoc: { x: 25, y: 25 },
        antHeading: 0,
        rule: {string: newRule, parsed: validatedRule}
      });
    }
  }

  render(){
    const { board, animating } = this.state;
    const rule = this.state.rule.string; 
    const valid = this.state.rule.parsed;
    const control = this.ruleControl;
  return (
    <div className="App">
      <header className="App-header">
        <h1>Langton's Ant</h1>
        <p className={valid ? "" : "errortext"} >
          {valid ? "Input a rule!" : "Valid rules are strings of the characters L, R and U"}
        </p>
        <div>
          <input className={!animating ? "normal" : "locked" } value={rule} onChange={(e) => control(e)} />
          <button onClick = {() => this.animateAnt()}>{ !animating ? "GO!" : "STOP!" }</button>
        </div>
        <table>
          <tbody>
           {board.map( (row, index) => {
             return (
               <tr key={index}>
                 {row.map( (cell,index) => {
                   return <td key ={index} className={cellType[cell]}></td>
                 })}
               </tr>
             )
           })}         
          </tbody>
        </table>
      </header>
    </div>
  );
  }
}

export default App;
