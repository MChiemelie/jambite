import { getSubscription } from '@/services/payments';
import Card from './card';

export default async function Subscription() {
  const subscriptions = await getSubscription();
  const subscription = subscriptions?.[0];

  if (!subscription) {
    return;
  }

  const { plan, status, subscription_code, authorization, next_payment_date } = subscription;
  const { bank, channel, brand, last4, exp_month, exp_year } = authorization;

  return (
    <div className="w-full p-6">
      <h3 className="text-lg text-center font-semibold mb-4">Subscription Details</h3>
      <div className="md:flex items-center justify-evenly gap-8 w-full">
        <div className="w-full md:w-1/2 mx-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm text-left">
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Plan</td>
                <td className="border border-gray-300 px-4 py-2">{plan?.name}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Status</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{status}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Account Name</td>
                <td className="border border-gray-300 px-4 py-2">{plan?.account_name}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Code</td>
                <td className="border border-gray-300 px-4 py-2 lowercase">{subscription_code}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Bank</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{bank}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Payment Method</td>
                <td className="border border-gray-300 px-4 py-2">{channel === 'card' ? `${brand.charAt(0).toUpperCase() + brand.slice(1)} - ends with ${last4} - expiries on ${exp_month}/${exp_year}` : channel}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Next Payment</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(next_payment_date).toLocaleDateString()}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="border-t border-gray-300 py-1 text-center text-xs text-gray-500">
                  The above data is based on your last subscription.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="w-full md:w-1/2">
          <Card authorization={authorization} />
        </div>
      </div>
    </div>
  );
}
