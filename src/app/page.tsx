"use client";
import { Campaign, setAdSetFilter, setCampaigns } from "@/redux/ads-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {

  const [state, setState] = useState<Campaign[]>([])
  const dispatch = useAppDispatch();
  const adsReducer = useAppSelector((state) => state.adsReducer)

  const { campaigns, adSetFilters } = adsReducer

  const { data, error } = useSWR("/api/getCampaigns", fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: !(campaigns.length > 0),
    refreshInterval: 0,
  });

  useEffect(() => {
    if (data) {
      setState(data)
    }
  }, [data])

  //Handle the error state
  if (error) {
    return <div>Failed to load</div>;
  }
  //Handle the loading state
  if (!data) return <div>Loading...</div>;
  //Handle the ready state and display the result contained in the data object mapped to the structure of the json file

  

  const handleSort = () => {
    let copyState = [...state]
    let sorted = copyState.sort((a: Campaign, b: Campaign) => a?.addtoCartValue - b?.addtoCartValue < 0 ? 1 : -1)
    setState(sorted)
  }
  return (
    <>
    <button onClick={() => handleSort()}>Sırala</button>
       <TableVirtuoso
      data={state.length > 0 ? state : campaigns}
      useWindowScroll
      fixedHeaderContent={() => (
        <tr className="bg-red-400">
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
            <th>Basket</th>
          </tr>
      )}
      itemContent={(index, campaign: Campaign) => (
        <>
          <td className="border border-separate border-black px-3 py-1">
                    <input
                      defaultChecked={adSetFilters.includes(String(campaign.id))}
                      name={String(campaign.id)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        dispatch(
                          setAdSetFilter({
                            id: e.target.name,
                            checked: e.target.checked,
                          })
                        )
                      }
                      type="checkbox"
                    />
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    <input defaultChecked={campaign.status} type="checkbox" />
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {campaign.name}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {campaign.budget}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {campaign.addtoCart}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {campaign.addtoCartValue}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {campaign.ctr}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {campaign.impressions}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {campaign.name}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {campaign.reach}
                  </td>
                  <td className="border border-separate border-black px-3 py-1">
                    {campaign.spend}
                  </td>
        </>
      )}
    />
    </>
  );
}
