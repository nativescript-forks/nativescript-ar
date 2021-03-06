import { Property } from "tns-core-modules/ui/core/view";
import { ContentView } from "tns-core-modules/ui/content-view";
import { EventData } from "tns-core-modules/data/observable";

export enum ARDebugLevel {
  NONE = <any>"NONE",
  WORLD_ORIGIN = <any>"WORLD_ORIGIN",
  FEATURE_POINTS = <any>"FEATURE_POINTS",
  PHYSICS_SHAPES = <any>"PHYSICS_SHAPES"
}

const debugLevelProperty = new Property<AR, ARDebugLevel>({
  name: "debugLevel",
  defaultValue: ARDebugLevel.NONE
});

const planeMaterialProperty = new Property<AR, string>({
  name: "planeMaterial"
});

const planeOpacityProperty = new Property<AR, number>({
  name: "planeOpacity",
  defaultValue: 0.1
});

export interface ARNode {
  id: string;
  position: ARPosition;
  scale?: number | ARScale;
  rotation?: ARRotation;
  ios?: any; /* SCNNode */
  android?: any; /**/
  remove(): void;
  // TODO add animate({});
}

export interface ARAddOptions {
  position: ARPosition;
  scale?: number | ARScale;
  rotation?: ARRotation;
  mass?: number;
  onTap?: (model: ARNode) => void;
  onLongPress?: (model: ARNode) => void;
}

export interface ARAddGeometryOptions extends ARAddOptions {
  material?: string;
}

export interface ARAddModelOptions extends ARAddOptions {
  name: string;
  childNodeName?: string;
}

export interface ARAddBoxOptions extends ARAddGeometryOptions {
  dimensions: number | ARDimensions;
  chamferRadius?: number;
}

export interface ARAddSphereOptions extends ARAddGeometryOptions {
  radius: number;
  segmentCount?: number;
}

export interface ARAddTextOptions extends ARAddGeometryOptions {
  /**
   * iOS: DefaultHelvetica 36 point.
   */
  // font?: string;
  text: string;
  /**
   * Leaving this out, or specifying 0.0 means 2D text is added.
   */
  depth?: number;
}

export interface ARAddTubeOptions extends ARAddGeometryOptions {
  innerRadius: number;
  outerRadius: number;
  height: number;
  radialSegmentCount?: number;
  heightSegmentCount?: number;
}

export interface ARPlane extends ARNode {
}

export interface AREventData extends EventData {
  object: AR;
}

export interface ARLoadedEventData extends AREventData {
  ios: any; /* ARSCNView */
}

export interface ARPlaneTappedEventData extends AREventData {
  position: ARPosition;
}

export interface ARPlaneDetectedEventData extends AREventData {
  plane: ARPlane;
}

export class ARDimensions {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class ARScale extends ARDimensions {
  // same as super
}

export class ARPosition extends ARDimensions {
  // same as super
}

export class ARRotation {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}

export abstract class AR extends ContentView {
  static arLoadedEvent: string = "arLoaded";
  static planeDetectedEvent: string = "planeDetected";
  static planeTappedEvent: string = "planeTapped";

  planeMaterial: string;
  planeOpacity: number;

  static isSupported(): boolean {
    return false;
  }

  /**
   * This one seems to need work, so not documented yet.
   */
  abstract reset(): void;

  abstract addModel(options: ARAddModelOptions): Promise<ARNode>;

  abstract addBox(options: ARAddBoxOptions): Promise<ARNode>;

  abstract addSphere(options: ARAddSphereOptions): Promise<ARNode>;

  abstract addText(options: ARAddTextOptions): Promise<ARNode>;

  abstract addTube(options: ARAddTubeOptions): Promise<ARNode>;

  abstract togglePlaneDetection(on: boolean): void;

  abstract toggleStatistics(on: boolean): void;

  abstract togglePlaneVisibility(on: boolean): void;

  abstract setDebugLevel(to: ARDebugLevel): void;

  [debugLevelProperty.setNative](value?: string | ARDebugLevel) {
    if (value) {
      if (typeof value === "string") {
        this.setDebugLevel(ARDebugLevel[value]);
      } else {
        this.setDebugLevel(<ARDebugLevel>value);
      }
    }
  }

  [planeMaterialProperty.setNative](value: string) {
    this.planeMaterial = value;
  }

  [planeOpacityProperty.setNative](value: number) {
    if (!isNaN(value)) {
      this.planeOpacity = +value;
    }
  }
}

debugLevelProperty.register(AR);
planeMaterialProperty.register(AR);
planeOpacityProperty.register(AR);
