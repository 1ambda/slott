
export default class Job {
  constructor(name = '', config = {}, running = true, disabled = false) {
    this.name = name
    this.config = config
    this.running = running
    this.disabled = disabled
  }
}
