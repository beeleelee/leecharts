import {
  isFunction
} from 'mytoolkit'

export default function drawBar(chart, layer, s, index) {
  if (!isFunction(s.draw)) return

  s.draw(chart, layer, s, index)
}