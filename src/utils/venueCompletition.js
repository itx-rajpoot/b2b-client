export default function getVenueCompletition(_venue) {
  const _onboarding = {
    progress: 0,
    details: [],
  };
  if (!_venue) return _onboarding;

  // # 1: Basic Info
  let basicInfoCompleted = true;
  if (!_venue.address) basicInfoCompleted = false;
  if (!_venue.category) basicInfoCompleted = false;
  if (!_venue.city) basicInfoCompleted = false;
  if (!_venue.email) basicInfoCompleted = false;
  if (!_venue.name) basicInfoCompleted = false;
  if (!_venue.phone) basicInfoCompleted = false;
  if (!_venue.state) basicInfoCompleted = false;
  if (!_venue.website) basicInfoCompleted = false;
  if (!_venue.zip_code) basicInfoCompleted = false;
  if (!_venue.price || _venue.price.length === 0) basicInfoCompleted = false;
  if (!_venue.geo_segment) basicInfoCompleted = false;
  _onboarding.details.push({ title: 'Basic Info', completed: basicInfoCompleted });
  // # 2: App Images
  _onboarding.details.push({
    title: 'App Images',
    completed: Array.isArray(_venue.images) && _venue.images.length > 0,
  });
  // # 3: Hours of operation
  let hoursUpdated = false;
  if (Array.isArray(_venue.serviceHours)) {
    for (let i = 0; i < _venue.serviceHours.length; i++) {
      const day = _venue.serviceHours[i];
      if (day.blocks && day.blocks.length > 0) {
        hoursUpdated = true;
        break;
      }
    }
  }
  _onboarding.details.push({
    title: 'Hours of Operations',
    completed: hoursUpdated,
  });
  // # 4: Covid Policy
  if (typeof _venue.covidPolicy === 'object') {
    const {
      outdoor_seating,
      social_distance,
      masks,
      cleaning_desinfecting,
      temperature_checks,
      vaccination,
    } = _venue.covidPolicy;
    _onboarding.details.push({
      title: 'Covid Policy',
      completed:
        outdoor_seating ||
        social_distance ||
        masks ||
        cleaning_desinfecting ||
        temperature_checks ||
        vaccination,
    });
  }
  // # 5: Amenities
  _onboarding.details.push({
    title: 'Amenities',
    completed: Array.isArray(_venue.amenities) && _venue.amenities.length > 0,
  });
  // # 6: Type of Music
  _onboarding.details.push({
    title: 'Type of Music',
    completed: Array.isArray(_venue.music) && _venue.music.length > 0,
  });
  // # 7: Capacity
  _onboarding.details.push({
    title: 'Capacity',
    completed: _venue.capacity !== null && _venue.capacity !== undefined,
  });

  // Total Progress
  _onboarding.progress = _onboarding.details.reduce((acc, a) => acc + (a.completed ? 1 : 0), 0);
  return _onboarding;
}
