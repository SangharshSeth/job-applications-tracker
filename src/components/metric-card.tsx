import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string | undefined
  icon: React.ReactNode
  iconColor: string
}

export default function MetricCard({
  title,
  value,
  icon,
  iconColor
}: MetricCardProps) {
  const formattedValue = new Intl.NumberFormat('en-US').format(parseInt(value as string))
  const bgColor = `${iconColor.split('-')[1]}-100`;
  const textColor = `${iconColor.split('-')[1]}-600`;
  console.log(bgColor)
  
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <div className={`rounded-lg  bg-${bgColor} p-2`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
          <span className="text-md font-medium truncate">
            {title}
          </span>
        </div>
        
        <h2 className={`text-3xl text-${textColor}  font-bold tracking-tight ml-12  whitespace-nowrap`}>
          {formattedValue}
        </h2>
      </CardContent>
    </Card>
  )
}

