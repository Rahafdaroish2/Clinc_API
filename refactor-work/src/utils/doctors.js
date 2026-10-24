// Callers normalize queries so whitespace-only submit behavior stays unchanged.
export function matchesDoctor(doctor, query) {
  return doctor.name.toLowerCase().includes(query) ||
    doctor.specialty.toLowerCase().includes(query);
}
