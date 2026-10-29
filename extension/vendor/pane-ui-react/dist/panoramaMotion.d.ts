export type MotionSample = {
    x: number;
    time: number;
};
export type GestureDecision = {
    width: number;
    startIndex: number;
    count: number;
    dx: number;
    velocity: number;
};
export declare function gestureTarget({ width, startIndex, count, dx, velocity, }: GestureDecision): number;
export declare function gestureIntent(dx: number, dy: number): "pending" | "horizontal" | "vertical";
/** A pause empties the velocity window; old movement cannot turn a hold into a fling. */
export declare function recentVelocity(samples: readonly MotionSample[]): number;
export declare function resistBoundary(position: number, count: number): number;
