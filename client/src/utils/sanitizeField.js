const NAME_DISALLOWED = /[^A-Za-z\s'-]/g
const ADDRESS_DISALLOWED = /[^A-Za-z0-9\s,.'#/-]/g
const EMOJI = /\p{Extended_Pictographic}/gu

const FILTERS = {
  fullName: (value) => value.replace(NAME_DISALLOWED, ''),
  firstName: (value) => value.replace(NAME_DISALLOWED, ''),
  recipientName: (value) => value.replace(NAME_DISALLOWED, ''),
  address: (value) => value.replace(ADDRESS_DISALLOWED, ''),
  city: (value) => value.replace(ADDRESS_DISALLOWED, ''),
  notes: (value) => value.replace(EMOJI, ''),
  message: (value) => value.replace(EMOJI, ''),
}

export function sanitizeField(name, value) {
  const filter = FILTERS[name]
  return filter ? filter(value) : value
}
