// It's a clone of `resizingComment` mode with a little changes
// One day we'll get rid of special "Comment" entity and only this mode will stay

import * as R from 'ramda';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import * as XP from 'xod-project';

import { EDITOR_MODE } from '../../../constants';

import PatchSVG from '../../../../project/components/PatchSVG';
import * as Layers from '../../../../project/components/layers';

import {
  addPoints,
  subtractPoints,
  pointToSize,
  sizeToPoint,
  snapNodeSizeToSlots,
  pixelSizeToSlots,
  slotSizeToPixels,
  NODE_HEIGHT,
  PIN_RADIUS,
  SLOT_SIZE,
} from '../../../../project/nodeLayout';
import { getPxSize } from '../../../../project/pxDimensions';

import { getOffsetMatrix, bindApi, getMousePosition } from '../modeUtils';
import { isLinkConnectedToNodeIds } from '../../../../project/utils';
import { shortenDraggedLinks } from './moving';

const updateLinksPositions = R.uncurryN(2)(resizedNodes =>
  R.map(link => {
    // only outputs are moving during node resizing
    const nodeId = XP.getLinkOutputNodeId(link);

    if (!R.has(nodeId, resizedNodes)) return link;

    const node = resizedNodes[nodeId];
    // pins are moved only vertically during resizing,
    // so we don't touch the `x`
    const linkEndY =
      node.pxPosition.y + node.pins[XP.getLinkOutputPinKey(link)].position.y;

    return R.assocPath(['to', 'y'], linkEndY, link);
  })
);

let patchSvgRef = null;

const getDeltaPosition = api =>
  subtractPoints(api.state.mousePosition, api.state.dragStartPosition);

const addDeltaToSize = R.uncurryN(2)(deltaPosition =>
  R.compose(pointToSize, addPoints(deltaPosition), sizeToPoint)
);

const addDeltaToPinPosition = R.curry((deltaPosition, pin) =>
  R.over(
    R.lensProp('position'),
    pinPosition => ({
      x: pinPosition.x,
      y: Math.max(
        pinPosition.y + deltaPosition.y,
        NODE_HEIGHT - PIN_RADIUS / 2
      ),
    }),
    pin
  )
);

const addDeltaToNodeSizes = R.uncurryN(2)(deltaPosition =>
  R.map(
    R.compose(
      R.over(
        R.lensProp('pins'),
        R.map(
          R.when(
            R.propEq('direction', 'output'),
            addDeltaToPinPosition(deltaPosition)
          )
        )
      ),
      R.over(
        R.lensProp('pxSize'),
        R.compose(
          R.evolve({
            width: R.max(SLOT_SIZE.WIDTH),
            height: R.max(NODE_HEIGHT),
          }),
          addDeltaToSize(deltaPosition)
        )
      )
    )
  )
);

const resizingNodeMode = {
  getInitialState(props, { dragStartPosition, resizedNodeId }) {
    // performance optimization:
    // hide instead of unmounting and then remounting again
    const idleNodes = R.assocPath([resizedNodeId, 'hidden'], true, props.nodes);

    return {
      idleNodes,
      resizedNodeId,
      dragStartPosition,
      mousePosition: dragStartPosition,
    };
  },

  onMouseMove(api, event) {
    const mousePosition = getMousePosition(patchSvgRef, api.getOffset(), event);
    api.setState({ mousePosition });
  },
  onMouseUp(api) {
    const { resizedNodeId } = api.state;
    const deltaPosition = getDeltaPosition(api);

    const resizedNode = R.prop(resizedNodeId, api.props.nodes);

    const originalSizeInSlots = R.compose(
      R.evolve({
        width: Math.ceil,
        height: Math.ceil,
      }),
      pixelSizeToSlots
    )(resizedNode.originalSize);

    const newSize = R.compose(
      R.evolve({
        width: R.max(originalSizeInSlots.width),
        height: R.max(originalSizeInSlots.height),
      }),
      snapNodeSizeToSlots,
      addDeltaToSize(deltaPosition),
      getPxSize
    )(resizedNode);

    // In case that User resized Node to it's default size — just drop it to
    // zero values. In this case it will be omitted from xodball
    const sizeToSet = R.equals(originalSizeInSlots, newSize)
      ? { width: 0, height: 0 }
      : newSize;

    api.props.actions.resizeNode(resizedNodeId, sizeToSet);
    api.goToMode(EDITOR_MODE.DEFAULT);
  },

  render(api) {
    const deltaPosition = getDeltaPosition(api);

    const { resizedNodeId, idleNodes } = api.state;

    const resizedNodes = R.compose(
      addDeltaToNodeSizes(deltaPosition),
      R.pick([resizedNodeId])
    )(api.props.nodes);

    const [draggedLinks, idleLinks] = R.compose(
      R.over(R.lensIndex(0), updateLinksPositions(resizedNodes)),
      R.partition(isLinkConnectedToNodeIds([resizedNodeId]))
    )(api.props.links);

    const shortenedDraggedLinks = shortenDraggedLinks(draggedLinks);

    const snappedPreviews = R.compose(
      R.map(
        R.compose(
          R.over(
            R.lensProp('pxSize'),
            R.pipe(snapNodeSizeToSlots, slotSizeToPixels)
          ),
          R.pick(['pxSize', 'pxPosition'])
        )
      ),
      R.values
    )(resizedNodes);

    return (
      <HotKeys className="PatchWrapper" handlers={{}}>
        <PatchSVG
          onMouseMove={bindApi(api, this.onMouseMove)}
          onMouseUp={bindApi(api, this.onMouseUp)}
          svgRef={svg => {
            patchSvgRef = svg;
          }}
        >
          <Layers.Background
            width={api.props.size.width}
            height={api.props.size.height}
            offset={api.getOffset()}
          />
          <g transform={getOffsetMatrix(api.getOffset())}>
            <Layers.Comments
              comments={api.props.comments}
              selection={api.props.selection}
              onFinishEditing={api.props.actions.editComment}
            />
            <Layers.Links links={idleLinks} selection={api.props.selection} />
            <Layers.Nodes
              nodes={idleNodes}
              selection={api.props.selection}
              linkingPin={api.props.linkingPin}
            />
            <Layers.LinksOverlay
              hidden // to avoid heavy remounting
              links={api.props.links}
              selection={api.props.selection}
            />
            <Layers.NodePinsOverlay
              hidden // to avoid heavy remounting
              nodes={api.props.nodes}
              linkingPin={api.props.linkingPin}
            />

            <Layers.SnappingPreview previews={snappedPreviews} />
            <Layers.Links
              key="dragged links"
              links={shortenedDraggedLinks}
              selection={api.props.selection}
              isDragged
            />
            <Layers.Nodes
              key="resized node"
              areDragged
              nodes={resizedNodes}
              selection={api.props.selection}
              linkingPin={api.props.linkingPin}
            />
          </g>
        </PatchSVG>
      </HotKeys>
    );
  },
};

export default resizingNodeMode;
