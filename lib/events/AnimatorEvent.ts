import EventBase					= require("awayjs-core/lib/events/EventBase");

import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");

/**
 * Dispatched to notify changes in an animator's state.
 */
class AnimatorEvent extends EventBase
{
	/**
	 * Defines the value of the type property of a start event object.
	 */
	public static START:string = "animatorStart";

	/**
	 * Defines the value of the type property of a stop event object.
	 */
	public static STOP:string = "animatorStop";

	/**
	 * Defines the value of the type property of a cycle complete event object.
	 */
	public static CYCLE_COMPLETE:string = "animatorCycleComplete";

	private _animator:AnimatorBase;

	/**
	 * Create a new <code>AnimatorEvent</code> object.
	 *
	 * @param type The event type.
	 * @param animator The animator object that is the subject of this event.
	 */
	constructor(type:string, animator:AnimatorBase)
	{
		super(type);
		this._animator = animator;
	}

	public get animator():AnimatorBase
	{
		return this._animator;
	}

	/**
	 * Clones the event.
	 *
	 * @return An exact duplicate of the current event object.
	 */
	public clone():AnimatorEvent
	{
		return new AnimatorEvent(this.type, this._animator);
	}
}

export = AnimatorEvent;