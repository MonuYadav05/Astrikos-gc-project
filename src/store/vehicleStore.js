import create from 'zustand'

export const useVehicleStore = create(set => ({
  vehicles: {
    ambulance: [0, 0.5, 0],
    police: [5, 0.5, 5]
  },
  updateVehicle: (type, position) =>
    set(state => ({
      vehicles: {
        ...state.vehicles,
        [type]: position
      }
    }))
}))
