import hospital from './hospital.js'
import police from './police.js'
import government from './government.js'
import embassy from './embassy.js'

export const venues = [hospital, police, government, embassy]

export const DEFAULT_VENUE_ID = 'hospital'

export function getVenue(id) {
  return venues.find((v) => v.id === id) ?? venues.find((v) => v.id === DEFAULT_VENUE_ID)
}

export function getCategory(venue, categoryId) {
  return venue.categories.find((c) => c.id === categoryId) ?? null
}

export function getSubcategory(venue, categoryId, subcategoryId) {
  const category = getCategory(venue, categoryId)
  return category?.subcategories.find((s) => s.id === subcategoryId) ?? null
}

export function getDepartment(venue, departmentId) {
  return venue.departments.find((d) => d.id === departmentId) ?? null
}
