/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor','zhaodong']
  return true
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
