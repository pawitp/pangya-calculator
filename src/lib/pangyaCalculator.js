// Codification of http://pangyacelebrity.boards.net/thread/166/nyas-non-excel-calculation-guide
const CALIPER_STEPS = 72
const CALIPER_DIFF = 20 / CALIPER_STEPS
const VWI_NEG_MULTIPLIER = 1.25
const VWI_POS_MULTIPLIER = 1.0

const PARAMS = {
  pin: { '80': 233.9, '90': 266.75, '100': 299.6 },
  hwi: { '80': 0.5471, '90': 0.7702, '100': 1.0517 },
  heightPos: { '80': 1.4798, '90': 1.0674, '100': 0.77 },
  heightNeg: { '80': 1.2491, '90': 0.9011, '100': 0.65 },
  heightModPos: 0.0135,
  heightModNeg: 0.0094,
  yardToCm: 18.2 / 12,
  totalDist: 294
}

function generateCaliperPercentages() {
  var percentages = []
  var percent = 100
  while (percent > 80) {
    percentages.push(percent)
    percent -= CALIPER_DIFF
  }
  return percentages
}

function getCaliperDist(params, percent) {
  return percent * params.totalDist / 100
}

function getValueAtPercent(percent, values) {
  if (percent > 90) {
    const diff = values['100'] - values['90']
    const minusPercent = 100 - percent
    return values['100'] - minusPercent * diff / 10
  } else {
    const diff = values['90'] - values['80']
    const minusPercent = 90 - percent
    return values['90'] - minusPercent * diff / 10
  }
}

function getPercentAtValue(value, values) {
  if (value > values['90']) {
    const diff = values['100'] - values['90']
    const minusValue = values['100'] - value
    return 100 - minusValue * 10 / diff
  } else {
    const diff = values['90'] - values['80']
    const minusValue = values['90'] - value
    return 90 - minusValue * 10 / diff
  }
}

// For params.hwi/H+/H-
function getSpecialValueAtDist(params, pinDist, values) {
  return (
    values['100'] *
      (pinDist - params.pin['90']) *
      (pinDist - params.pin['80']) /
      ((params.pin['100'] - params.pin['90']) *
        (params.pin['100'] - params.pin['80'])) +
    values['90'] *
      (pinDist - params.pin['100']) *
      (pinDist - params.pin['80']) /
      ((params.pin['90'] - params.pin['100']) *
        (params.pin['90'] - params.pin['80'])) +
    values['80'] *
      (pinDist - params.pin['100']) *
      (pinDist - params.pin['90']) /
      ((params.pin['80'] - params.pin['100']) *
        (params.pin['80'] - params.pin['90']))
  )
}

function getVwi(hwi, multiplier) {
  return hwi * multiplier
}

function getVwiAtDist(params, dist, height) {
  const hwi = getSpecialValueAtDist(params, dist, params.hwi)
  const pureVwi = getVwi(
    hwi,
    height > 0 ? VWI_POS_MULTIPLIER : VWI_NEG_MULTIPLIER
  )
  return pureVwi - height / 100
}

function getHeightInfluenceAtDist(params, dist, height) {
  const heightMultiplier = getSpecialValueAtDist(
    params,
    dist,
    height > 0 ? params.heightPos : params.heightNeg
  )
  return height * heightMultiplier
}

// For checking table
export function generateTable(params) {
  return generateCaliperPercentages().map(percent => {
    const caliperDist = getCaliperDist(params, percent)
    const pinDist = getValueAtPercent(percent, params.pin)
    const hwi = getSpecialValueAtDist(params, pinDist, params.hwi)
    const hPos = getSpecialValueAtDist(params, pinDist, params.heightPos)
    const hNeg = getSpecialValueAtDist(params, pinDist, params.heightNeg)
    const vwiPos = getVwi(hwi, VWI_NEG_MULTIPLIER)
    const vwiNeg = getVwi(hwi, VWI_POS_MULTIPLIER)
    return {
      percent: percent.toFixed(2),
      caliperDist: caliperDist.toFixed(1),
      pinDist: pinDist.toFixed(2),
      hwi: hwi.toFixed(3),
      hPos: hPos.toFixed(3),
      hNeg: hNeg.toFixed(3),
      vwiNeg: vwiNeg.toFixed(3),
      vwiPos: vwiPos.toFixed(3)
    }
  })
}

function decToRad(angle) {
  return angle * (Math.PI / 180)
}

function calculatePower(params, dist, height, wind, angle) {
  const result1 = dist // TODO: Terrain
  const result2 =
    result1 -
    wind * Math.cos(decToRad(angle)) * getVwiAtDist(params, result1, height)
  const result3 = result2 + getHeightInfluenceAtDist(params, result2, height)
  return result3
}

function getCaliperForDist(params, dist) {
  const percent = getPercentAtValue(dist, params.pin)
  const caliperRawDist = percent * params.totalDist / 100

  const validPercentages = generateCaliperPercentages()
  validPercentages.sort((a, b) => Math.abs(a - percent) - Math.abs(b - percent))
  const roundedPercent = validPercentages[0]
  const caliperDist = roundedPercent * params.totalDist / 100
  const caliperPinDist = getValueAtPercent(roundedPercent, params.pin)
  return { caliperDist, caliperPinDist, caliperRawDist }
}

function getHorizotalForDist(params, dist, height, wind, angle) {
  const hwi3 = getSpecialValueAtDist(params, dist, params.hwi)
  const heightMod = height > 0 ? params.heightModPos : params.heightModNeg
  const result4 = hwi3 - height * heightMod
  const result5 = result4 * Math.abs(wind) * Math.sin(decToRad(angle))
  const result6 = result5 // TODO: Slope
  return result6
}

function calculateAll(params, dist, height, wind, angle) {
  const pinDist = calculatePower(params, dist, height, wind, angle)
  const { caliperDist, caliperPinDist, caliperRawDist } = getCaliperForDist(
    params,
    pinDist
  )
  const hDist = getHorizotalForDist(params, pinDist, height, wind, angle)
  const hDistScaled = hDist * params.yardToCm
  return {
    pinDist: pinDist.toFixed(1),
    caliperDist: caliperDist.toFixed(1),
    caliperPinDist: caliperPinDist.toFixed(1),
    caliperRawDist: caliperRawDist.toFixed(1),
    hDist: hDist.toFixed(2),
    hDistScaled: hDistScaled.toFixed(1)
  }
}

export function sumLoss(data) {
  var total = 0
  for (let entry of data) {
    total += Math.pow(entry, 2)
  }
  return Math.pow(total / data.length, 0.5)
}

export default calculateAll
export const defaultParams = PARAMS
