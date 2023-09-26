"use client";
import { Ad, AdSet, setAds } from "@/redux/ads-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import useSWR from "swr";

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function Home() {
  const dispatch = useAppDispatch();
  const ads = useAppSelector((state) => state.adsReducer.ads);
  const filters = useAppSelector((state) => state.adsReducer.adFilters);

  const { data, error } = useSWR("/api/getAds", fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: !(ads.length > 0),
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
    dispatch(setAds(data));
  }

  let filtered = ads.filter((ad: Ad) =>
    filters.length > 0 ? filters.includes(String(ad.adsetId)) : true
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <table>
        <thead>
          <tr>
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
            ? filtered?.map((ad: Ad) => (
                <tr>
                  <td className="border border-separate border-black px-3 py-1">
                    <input defaultChecked={ad.status} type="checkbox" />
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {ad.name}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {ad.budget}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {ad.addtoCart}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {ad.addtoCartValue}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {ad.ctr}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {ad.impressions}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {ad.name}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {ad.reach}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {ad.spend}
                  </td>
                </tr>
              ))
            : ""}
        </tbody>
      </table>
    </main>
  );
}
