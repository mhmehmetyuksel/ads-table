'use client'
import useSWR from "swr";

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR('/api/getCampaigns', fetcher);

  //Handle the error state
  if (error) {
    console.log(error, "erorr")
    return <div>Failed to load</div> 
  };
  //Handle the loading state
  if (!data) return <div>Loading...</div>;
  //Handle the ready state and display the result contained in the data object mapped to the structure of the json file
  if(data) {
    console.log(data, "data??")
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Şuanda Kampanyalar sayfasındasın!
    </main>
  )
}
