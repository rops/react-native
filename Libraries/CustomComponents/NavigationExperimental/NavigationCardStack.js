/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * Facebook, Inc. ("Facebook") owns all right, title and interest, including
 * all intellectual property and other proprietary rights, in and to the React
 * Native CustomComponents software (the "Software").  Subject to your
 * compliance with these terms, you are hereby granted a non-exclusive,
 * worldwide, royalty-free copyright license to (1) use and copy the Software;
 * and (2) reproduce and distribute the Software as part of your own software
 * ("Your Software").  Facebook reserves all rights not expressly granted to
 * you in this license agreement.
 *
 * THE SOFTWARE AND DOCUMENTATION, IF ANY, ARE PROVIDED "AS IS" AND ANY EXPRESS
 * OR IMPLIED WARRANTIES (INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE) ARE DISCLAIMED.
 * IN NO EVENT SHALL FACEBOOK OR ITS AFFILIATES, OFFICERS, DIRECTORS OR
 * EMPLOYEES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @providesModule NavigationCardStack
 * @flow
 */
'use strict';

const Animated = require('Animated');
const NavigationAnimatedView = require('NavigationAnimatedView');
const NavigationCard = require('NavigationCard');
const NavigationCardStackStyleInterpolator = require('NavigationCardStackStyleInterpolator');
const NavigationContainer = require('NavigationContainer');
const NavigationLinearPanResponder = require('NavigationLinearPanResponder');
const NavigationPropTypes = require('NavigationPropTypes');
const React = require('React');
const ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');
const StyleSheet = require('StyleSheet');

const emptyFunction = require('fbjs/lib/emptyFunction');

const {PropTypes} = React;
const {Directions} = NavigationLinearPanResponder;

import type {
  NavigationAnimatedValue,
  NavigationAnimationSetter,
  NavigationParentState,
  NavigationSceneRenderer,
  NavigationSceneRendererProps,
} from 'NavigationTypeDefinition';

import type {
  NavigationGestureDirection,
} from 'NavigationLinearPanResponder';

type Props = {
  direction: NavigationGestureDirection,
  navigationState: NavigationParentState,
  renderOverlay: ?NavigationSceneRenderer,
  renderScene: NavigationSceneRenderer,
};

const propTypes = {
  direction: PropTypes.oneOf([Directions.HORIZONTAL, Directions.VERTICAL]),
  navigationState: NavigationPropTypes.navigationParentState.isRequired,
  renderOverlay: PropTypes.func,
  renderScene: PropTypes.func.isRequired,
};

const defaultProps = {
  direction: Directions.HORIZONTAL,
  renderOverlay: emptyFunction.thatReturnsNull,
};

/**
 * A controlled navigation view that renders a list of cards.
 */
class NavigationCardStack extends React.Component {
  _applyAnimation: NavigationAnimationSetter;
  _renderScene : NavigationSceneRenderer;

  constructor(props: Props, context: any) {
    super(props, context);
  }

  componentWillMount(): void {
    this._applyAnimation = this._applyAnimation.bind(this);
    this._renderScene = this._renderScene.bind(this);
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object): boolean {
    return ReactComponentWithPureRenderMixin.shouldComponentUpdate.call(
      this,
      nextProps,
      nextState
    );
  }

  render(): ReactElement {
    return (
      <NavigationAnimatedView
        navigationState={this.props.navigationState}
        renderOverlay={this.props.renderOverlay}
        renderScene={this._renderScene}
        applyAnimation={this._applyAnimation}
        style={[styles.animatedView, this.props.style]}
      />
    );
  }

  _renderScene(props: NavigationSceneRendererProps): ReactElement {
    const isVertical = this.props.direction === 'vertical';

    const style = isVertical ?
      NavigationCardStackStyleInterpolator.forVertical(props) :
      NavigationCardStackStyleInterpolator.forHorizontal(props);

    const panHandlers = isVertical ?
      NavigationLinearPanResponder.forVertical(props) :
      NavigationLinearPanResponder.forHorizontal(props);

    return (
      <NavigationCard
        {...props}
        key={'card_' + props.scene.key}
        panHandlers={panHandlers}
        renderScene={this.props.renderScene}
        style={style}
      />
    );
  }

  _applyAnimation(
    position: NavigationAnimatedValue,
    navigationState: NavigationParentState,
  ): void {
    Animated.timing(
      position,
      {
        duration: 500,
        toValue: navigationState.index,
      }
    ).start();
  }
}

NavigationCardStack.propTypes = propTypes;
NavigationCardStack.defaultProps = defaultProps;

const styles = StyleSheet.create({
  animatedView: {
    flex: 1,
  },
});

module.exports = NavigationContainer.create(NavigationCardStack);
