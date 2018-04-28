export default function(input) {
  return typeof input === 'string' ? input : input == null ? '' : input.toString()
}
