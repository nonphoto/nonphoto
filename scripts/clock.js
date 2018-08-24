/**
* A class for starting and stopping a time interval.
*/
export default class Clock {

  /**
   * Create a new clock.
   * @param {function} callback - The function to call when the interval fires.
   * @param {Number} wait - The length of the interval.
   */
  constructor( callback, wait = 1000 ) {
    this.wait = wait

    if ( typeof callback === 'function' ) {
      this.callback = callback
    }
    else {
      this.callback = () => {}
    }

    this.interval = null
  }

  /**
   * Return true if the clock was started.
   */
  get isRunning() {
    return this.interval !== null
  }

  /**
  * Start the interval
  */
  start() {
    if ( !this.interval ) {
      this.interval = window.setInterval( this.callback, this.wait )
    }
  }

  /**
  * Stop the interval.
  */
  stop() {
    if ( this.interval ) {
      window.clearInterval( this.interval )
      this.interval = null
    }
  }
}
