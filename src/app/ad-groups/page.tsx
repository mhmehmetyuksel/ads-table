"use client";
import { AdSet, setAdFilter, setAdSets } from "@/redux/ads-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import useSWR from "swr";

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function Home() {
  const dispatch = useAppDispatch();
  const adsReducer = useAppSelector((state) => state.adsReducer);
  const { adSets, adSetFilters, adFilters } = adsReducer;
  const { data, error } = useSWR("/api/getAdGroups", fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: !(adSets.length > 0),
    refreshInterval: 0,
  });

  //Handle the error state
  if (error) {
    console.log(error, "erorr");
    return <div>Failed to load</div>;
  }
  //Handle the loading state
  if (!data) return <div>Loading...</div>;
  //Handle the ready state and display the result contained in the data object mapped to the structure of the json file
  if (data) {
    dispatch(setAdSets(data));
  }

  let filtered = data.filter((adSet: AdSet) =>
    adSetFilters.length > 0
      ? adSetFilters.includes(String(adSet.campaignId))
      : true
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <table>
        <thead>
          <tr>
            <th>Filtre</th>
            <th>Yayın</th>
            <th>Kampanya</th>
            <th>Bütçe</th>
            <th>Harcama</th>
            <th>Purchase</th>
            <th>CPA</th>
            <th>Conversion</th>
            <th>ROAS</th>
            <th>Basket</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0
            ? filtered?.map((adSet: AdSet) => (
                <tr>
                  <td className="border border-separate border-black px-3 py-1">
                    <input
                      defaultChecked={adFilters.includes(String(adSet.id))}
                      name={String(adSet.id)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        dispatch(
                          setAdFilter({
                            id: e.target.name,
                            checked: e.target.checked,
                          })
                        )
                      }
                      type="checkbox"
                    />
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    <input defaultChecked={adSet.status} type="checkbox" />
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {adSet.name}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {adSet.budget}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {adSet.addtoCart}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {adSet.addtoCartValue}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {adSet.ctr}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {adSet.impressions}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {adSet.name}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {adSet.reach}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {adSet.spend}
                  </td>
                </tr>
              ))
            : ""}
        </tbody>
      </table>
    </main>
  );
}
