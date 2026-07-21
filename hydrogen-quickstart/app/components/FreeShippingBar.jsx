import { Money } from '@shopify/hydrogen'; 

export function FreeShippingBar({settings, cart}) {
  if (!settings?.enabled) return null;

  const subtotal = Number(cart?.cost?.subtotalAmount?.amount || 0);
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode || 'USD'; 

  const threshold = settings.threshold;
  const remaining = Math.max(threshold - subtotal, 0);
  const progress = subtotal >= threshold ? 100 : Math.round((subtotal / threshold) * 100);

  const remainingMoney = {
    amount: remaining.toString(),
    currencyCode: currencyCode,
  };

  const barColor = settings.barColor || '#000000';
  const bgColor = settings.backgroundColor || '#f3f4f6';

  return (
    <div className="p-3 rounded-lg mb-4" style={{backgroundColor: bgColor}}>
      {/* Message */}
      <div className="text-sm font-medium text-gray-800 mb-2">
        {remaining === 0 ? (
          settings.successText
        ) : (
          <span className="flex items-center gap-1">
            {settings.progressText.split('{{amount}}')[0]}
            <Money data={remainingMoney} />
            {settings.progressText.split('{{amount}}')[1]}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{width: `${progress}%`, backgroundColor: barColor}}
        />
      </div>
    </div>
  );
}