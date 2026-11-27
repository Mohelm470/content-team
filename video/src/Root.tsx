import React from "react";
import {Composition} from "remotion";
import {Short} from "./Video";
import {FPS, timeline} from "./timing";
import {Story} from "./types";
import test from "../stories/test-hund.json";

export const Root: React.FC = () => {
  const story = test as unknown as Story;
  return <Composition id="Short" component={Short as React.FC<any>} width={1080} height={1920} fps={FPS}
    durationInFrames={Math.ceil(timeline(story).total * FPS)} defaultProps={{story}}
    calculateMetadata={async ({props}) => ({durationInFrames: Math.ceil(timeline(props.story as Story).total * FPS)})} />;
};
