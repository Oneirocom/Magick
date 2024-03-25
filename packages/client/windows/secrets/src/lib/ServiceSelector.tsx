import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@magickml/client-ui'

export const ServiceSelector = ({
  selectedService,
  setSelectedService,
  pluginCredentials,
}) => {
  const groupedServices = pluginCredentials.reduce((acc, service) => {
    acc[service.clientName] = acc[service.clientName] || []
    if (service.available) acc[service.clientName].push(service)
    return acc
  }, {}) as Record<string, typeof pluginCredentials>

  return (
    <div className="flex items-center w-full col-span-3">
      {pluginCredentials.length > 0 && (
        <Select onValueChange={setSelectedService} value={selectedService}>
          <SelectTrigger className="w-[180px] border-white/20">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent className="bg-[#2b2b30]">
            {Object.keys(groupedServices).map(service =>
              groupedServices[service].map(service => (
                <SelectItem
                  key={service.name}
                  value={service.clientName}
                  className="hover:bg-white/20 focus:bg-white/20"
                >
                  <div className="inline-flex gap-x-0.5 items-center justify-center">
                    <img alt="" src={service.icon} className="w-4 h-4 mr-2" />
                    {service.clientName}
                  </div>
                </SelectItem>
              ))
            )}
            <SelectSeparator />
            <SelectItem
              className="hover:bg-white/20 focus:bg-white/20"
              value="custom"
            >
              Custom
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
