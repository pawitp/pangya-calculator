// From https://objectpartners.com/2017/04/24/two-way-data-binding-in-reactjs-part-i/

function bindModel(context) {
  return function(key) {
    return {
      value: context.state[key],
      checked: context.state[key],

      onChange(event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value

        context.setState({ [key]: value })

        if (typeof context.handleChange === 'function') {
          context.handleChange(key, value)
        }
      }
    }
  }
}

export default bindModel
