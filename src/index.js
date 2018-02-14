// @flow
import React from "react";
import { render } from "react-dom";
import "./index.css";
import styled, { keyframes, ThemeProvider, withTheme } from "styled-components";

const branch = prop => (arg1, arg2) => props => (props[prop] ? arg1 : arg2);
const branchFold = branch("fold");

const foldAnimation = keyframes`
  from {
    transform: rotateX(0deg);
  }
  to {
    transform: rotateX(-180deg);
  }
`;
const unfoldAnimation = keyframes`
  from {
    transform: rotateX(180deg);
  }
  to {
    transform: rotateX(0deg);
  }
`;

const FlipContainer = styled.div`
  position: relative;
  perspective-origin: 50% 50%;
  perspective: 300px;
  box-shadow: 1px;
  height: ${props => props.theme.flipCardHeight};
  width: ${props => props.theme.flipCardWidth};
  box-shadow: 0px 10px 10px -10px grey;
`;

const StyledCard = styled.div`
  align-items: flex-${props => props.alignItems};
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  height: 50%;
  overflow: hidden;
  background: ${props => props.theme.flipCardBackgroundColor};
  // border: ${props => props.theme.flipCardBorder};
`;

const FlipCard = styled.div`
  display: flex;
  transform-style: preserve-3d;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 50%;
  overflow: hidden;
  backface-visibility: hidden;
  top: ${branchFold("0", "50")}%;
  align-items: flex-${branchFold("end", "start")};
  transform-origin: ${branchFold("50% 100%", "50% 0%")};
  transform: rotateX(${branchFold("0", "180")}deg);
  animation: ${branchFold(foldAnimation, unfoldAnimation)}
    ${({ animationDuration }) => animationDuration / 1000}s
    cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s 1 normal forwards;
  background: ${props => props.theme.flipCardBackgroundColor};
  // border: ${props => props.theme.flipCardBorder};

  border-${branchFold('bottom', 'top')}: 0.5px solid gray;
`;

const flipCardTheme = theme => ({
  flipCardBackgroundColor: "yellow",
  flipCardBorder: "1px solid grey",
  flipCardHeight: "60px",
  flipCardWidth: "100%;",
  ...theme,
});

const TranslateDiv = styled.div`
  transform: translateY(${branch("negative")("-", "")}50%);
`;

class Card extends React.PureComponent<
  { children: React.Node },
  { shuffle: boolean }
> {
  static defaultProps = {
    animationDuration: 1000,
  };
  state = {
    shuffle: false,
    prevChildren: this.props.children,
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.children !== nextProps.children) {
      this.setState(({ shuffle, prevChildren }) => ({
        shuffle: !shuffle,
        prevChildren: this.timer ? prevChildren : this.props.children,
      }));
    }
  }

  componentDidUpdate() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.timer = null;
    }, this.props.animationDuration * 0.55);
  }

  render() {
    const { children, animationDuration, ...props } = this.props;
    const { shuffle, prevChildren } = this.state;

    const notShuffle = !shuffle;
    return (
      <ThemeProvider theme={flipCardTheme}>
        <FlipContainer {...props} className="FlipCard-FlipContainer">
          <StyledCard alignItems="end">
            <TranslateDiv>{children}</TranslateDiv>
          </StyledCard>
          <StyledCard alignItems="start">
            <TranslateDiv negative>{prevChildren}</TranslateDiv>
          </StyledCard>
          <FlipCard animationDuration={animationDuration} fold={shuffle}>
            <TranslateDiv negative={notShuffle}>
              {notShuffle ? children : prevChildren}
            </TranslateDiv>
          </FlipCard>
          <FlipCard animationDuration={animationDuration} fold={notShuffle}>
            <TranslateDiv negative={shuffle}>
              {shuffle ? children : prevChildren}
            </TranslateDiv>
          </FlipCard>
        </FlipContainer>
      </ThemeProvider>
    );
  }
}

class App extends React.Component {
  state = {
    counter: 0,
  };

  componentDidMount() {
    // setInterval(this.inc, 1000)
  }

  inc = () => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.inc}>+1</button>
        <Card height={300} width={60}>
          {this.state.counter}
        </Card>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
