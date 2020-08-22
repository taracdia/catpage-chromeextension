import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

//Can't be handled in CSS like usual because the
//element heights are dynamic
const onEnteronExiting = node => {
    node.style.marginTop = `-${node.offsetHeight}px`;
    node.style.marginBottom = `0px`;
};
const onEnteringonExit = node => {
    node.style.marginTop = "";
    node.style.marginBottom = "";
};

export default class Group extends Component {

    state = {
        items: []
    };

    //todo: update to use hooks
    componentWillReceiveProps({ children }) {
        this.setState({
            items: React.Children.toArray(children)
        })
    }

    render() {

        return <TransitionGroup>
            {
                this.state.items.map(
                    item => <CSSTransition
                        classNames="element"
                        key={item.key}
                        timeout={300}
                        onEnter={onEnteronExiting}
                        onEntering={onEnteringonExit}
                        onExit={onEnteringonExit}
                        onExiting={onEnteronExiting}>
                        {item}
                    </CSSTransition>
                )
            }
        </TransitionGroup>;
    }
}
