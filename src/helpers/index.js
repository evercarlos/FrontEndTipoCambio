export function showToast(error) {
  this.$toast.toast(error.response.data.message, {
    title: 'Ha ocurrido un error',
    variant: 'danger',
    solid: true,
  })
}
export function showError(error) {
  this.$toast.error(error.response.data.message, {
    title: 'Ha ocurrido un error',
    variant: 'danger',
    solid: true,
  })
}

export function onlyNumbers($event) {
  if ($event.charCode === 0 || /\d/.test(String.fromCharCode($event.charCode))) {
    return true
  }
  $event.preventDefault()
  return false
}

export function validDecimals($evt, refId, decimals, $refs) {
  // const inp = $refs[`est_${refId}`].localValue
  const inp = $refs[`est_${refId}`].localValue // [0]
  const texto = inp
  console.log(texto)// eslint-disable-line
  const punto = texto.indexOf('.')
  if ($evt.keyCode <= 13 || ($evt.keyCode >= 48 && $evt.keyCode <= 57)) {
    if ((punto !== -1) && (texto.length - (punto + 1)) >= decimals) {
      $evt.preventDefault()
      return false
    }
  } else if ($evt.keyCode === 46 && texto.length >= 1) {
    if (punto !== -1 && texto.indexOf('.', punto) !== -1) {
      $evt.preventDefault()
      return false
    }
  } else {
    $evt.preventDefault()
    return false
  }
  return true
}