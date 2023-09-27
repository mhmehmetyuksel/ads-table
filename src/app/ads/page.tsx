"use client";
import Loading from "@/components/Loading";
import { Ad, setAds } from "@/redux/ads-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { TableVirtuoso } from "react-virtuoso";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const dispatch = useAppDispatch();

  const adsReducer = useAppSelector((state) => state.adsReducer);
  const { ads, adFilters } = adsReducer

  const [columnWidth, setColumnWidth] = useState(800);
  const [state, setState] = useState<Ad[]>([])
  const [currentSortKey, setCurrentSortKey] = useState<{ key: string, status: string }>({ key: '', status: '' })

  const { data, error } = useSWR("/api/getAds", fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: !(ads.length > 0),
    refreshInterval: 0,
  });

  useEffect(() => {
    if (data) {
      let filtered = ads.filter((ad: Ad) =>
        adFilters.length > 0 ? adFilters.includes(String(ad.adsetId)) : true
      );
      setState(filtered)
    }
  }, [data])

  //Handle the error state
  if (error) {
    console.log(error, "erorr");
    return <div>Failed to load</div>;
  }
  //Handle the loading state
  if (!data) return <Loading />
  //Handle the ready state and display the result contained in the data object mapped to the structure of the json file
  if (data) {
    dispatch(setAds(data));
  }

  const handleSort = (key: keyof Omit<Ad, "status" | "name">) => {
    let sorted: Ad[]
    let copyState = [...state]
    if (key === currentSortKey.key) {
      if (currentSortKey.status === 'desc') {
        setCurrentSortKey({ key, status: 'asc' })
        sorted = copyState.sort((a: Omit<Ad, "status" | "name">, b: Omit<Ad, "status" | "name">) => a[key] - b[key] < 0 ? -1 : 1)
      } else {
        setCurrentSortKey({ key: '', status: '' })
        let filtered = ads.filter((ad: Ad) =>
        adFilters.length > 0 ? adFilters.includes(String(ad.adsetId)) : true
      );
      setState(filtered)
        return
      }
    } else {
      setCurrentSortKey({ key, status: 'desc' })
      sorted = copyState.sort((a: Omit<Ad, "status" | "name">, b: Omit<Ad, "status" | "name">) => a[key] - b[key] < 0 ? 1 : -1)
    }
    setState(sorted)
  }

  const onDragEnd = () => {
    console.log("Drag Success")
  }

  const handleColumnResizeStart = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();
    const initialX = e.clientX;
    const initialWidth = columnWidth || 800;

    const handleMouseMove = (e: MouseEvent) => {
      const widthChange = e.clientX - initialX;
      const newWidth = initialWidth + widthChange * 4.5;

      if (newWidth >= 100 && newWidth <= 2000) {
        setColumnWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      // onMouseUp olayını dinlemeyi bırak
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    // onMouseMove ve onMouseUp olaylarını dinle
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <TableVirtuoso
        className="rounded-lg border border-[#E7E7E8]"
        style={{ height: "80vh" }}
        data={state}
        components={{ Table: ({ style, ...props }) => <table {...props} style={{ ...style, width: "100%" }} /> }}
        fixedHeaderContent={() => (
          <Droppable droppableId="columns" direction="horizontal">
            {(provided) => (
              <tr className="bg-white text-base h-20" ref={provided.innerRef}>
                <th className="w-[60px]">Yayın</th>
                <Draggable
                  key={"campaign"}
                  draggableId={"campaign"}
                  index={1}
                >
                  {(provided) => (
                    <th
                      className="relative"
                      ref={provided.innerRef}
                      {...provided.draggableProps}

                      style={{ width: columnWidth }}
                    >Reklam
                      <span
                        {...provided.dragHandleProps}
                        className="resize-handle absolute right-0"
                        onMouseDown={(e) => {
                          handleColumnResizeStart(e);
                        }}
                      >≡</span>
                    </th>
                  )}
                </Draggable>
                <th className="relative w-[120px]"> Bütçe <button className="absolute right-0 text-[#8C8E90]" style={{ rotate: currentSortKey.key === 'budget' ? currentSortKey.status === 'asc' ? '-90deg' : '90deg' : '' }} onClick={() => handleSort('budget')}>&#62;</button></th>
                <th className="relative w-[120px]"> Harcama <button className="absolute right-0 text-[#8C8E90]" style={{ rotate: currentSortKey.key === 'addtoCart' ? currentSortKey.status === 'asc' ? '-90deg' : '90deg' : '' }} onClick={() => handleSort('addtoCart')}>&#62;</button></th>
                <th className="relative w-[120px]"> Purchase <button className="absolute right-0 text-[#8C8E90]" style={{ rotate: currentSortKey.key === 'addtoCartValue' ? currentSortKey.status === 'asc' ? '-90deg' : '90deg' : '' }} onClick={() => handleSort('addtoCartValue')}>&#62;</button></th>
                <th className="relative w-[120px]"> CPA <button className="absolute right-0 text-[#8C8E90]" style={{ rotate: currentSortKey.key === 'ctr' ? currentSortKey.status === 'asc' ? '-90deg' : '90deg' : '' }} onClick={() => handleSort('ctr')}>&#62;</button></th>
                <th className="relative w-[120px]"> Conversion <button className="absolute right-0 text-[#8C8E90]" style={{ rotate: currentSortKey.key === 'impressions' ? currentSortKey.status === 'asc' ? '-90deg' : '90deg' : '' }} onClick={() => handleSort('impressions')}>&#62;</button></th>
                <th className="relative w-[120px]"> ROAS <button className="absolute right-0 text-[#8C8E90]" style={{ rotate: currentSortKey.key === 'reach' ? currentSortKey.status === 'asc' ? '-90deg' : '90deg' : '' }} onClick={() => handleSort('reach')}>&#62;</button></th>
                <th className="relative w-[120px]"> Basket <button className="absolute right-2 text-[#8C8E90]" style={{ rotate: currentSortKey.key === 'spend' ? currentSortKey.status === 'asc' ? '-90deg' : '90deg' : '' }} onClick={() => handleSort('spend')}>&#62;</button></th>
              </tr>
            )}
          </Droppable>
        )}
        itemContent={(index, ad: Ad) => (
          <>
            <td style={{ backgroundColor: index % 2 === 0 ? '#F9F9F9' : '#FFFFFF' }} className="h-[70px] border border-collapse border-[#E7E7E8] px-3 py-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input defaultChecked={ad.status} type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#40C9A2]"></div>
              </label>
            </td>
            <td style={{ backgroundColor: index % 2 === 0 ? '#F9F9F9' : '#FFFFFF' }} className="h-[70px] border border-collapse border-[#E7E7E8] px-3 py-1">
              {ad.name}
            </td>
            <td style={{ backgroundColor: index % 2 === 0 ? '#F9F9F9' : '#FFFFFF' }} className="h-[70px] border border-collapse border-[#E7E7E8] px-3 py-1">
              {ad.budget}
            </td>
            <td style={{ backgroundColor: index % 2 === 0 ? '#F9F9F9' : '#FFFFFF' }} className="h-[70px] border border-collapse border-[#E7E7E8] px-3 py-1">
              {ad.addtoCart}
            </td>
            <td style={{ backgroundColor: index % 2 === 0 ? '#F9F9F9' : '#FFFFFF' }} className="h-[70px] border border-collapse border-[#E7E7E8] px-3 py-1">
              {ad.addtoCartValue}
            </td>
            <td style={{ backgroundColor: index % 2 === 0 ? '#F9F9F9' : '#FFFFFF' }} className="h-[70px] border border-collapse border-[#E7E7E8] px-3 py-1">
              {ad.ctr}
            </td>
            <td style={{ backgroundColor: index % 2 === 0 ? '#F9F9F9' : '#FFFFFF' }} className="h-[70px] border border-collapse border-[#E7E7E8] px-3 py-1">
              {ad.impressions}
            </td>
            <td style={{ backgroundColor: index % 2 === 0 ? '#F9F9F9' : '#FFFFFF' }} className="h-[70px] border border-collapse border-[#E7E7E8] px-3 py-1">
              {ad.reach}
            </td>
            <td style={{ backgroundColor: index % 2 === 0 ? '#F9F9F9' : '#FFFFFF' }} className="h-[70px] border border-collapse border-[#E7E7E8] px-3 py-1">
              {ad.spend}
            </td>
          </>
        )}
        fixedFooterContent={() => <>
          <td className="h-[84px] bg-[#FFFFFF] border border-[E7E7E8] px-3 py-1"></td>
          <td className="h-[84px] bg-[#FFFFFF] border border-[E7E7E8] px-3 py-1">{state.length} Reklamdan Toplamlar</td>
          <td className="h-[84px] bg-[#FFFFFF] border border-[E7E7E8] px-3 py-1">{Math.round(state.reduce((accumulator, currentValue) => accumulator + currentValue.budget, 0)) * 100 / 100} ₺</td>
          <td className="h-[84px] bg-[#FFFFFF] border border-[E7E7E8] px-3 py-1">{Math.round(state.reduce((accumulator, currentValue) => accumulator + currentValue.addtoCart, 0) * 100 / 100)} ₺</td>
          <td className="h-[84px] bg-[#FFFFFF] border border-[E7E7E8] px-3 py-1">{Math.round(state.reduce((accumulator, currentValue) => accumulator + currentValue.addtoCartValue, 0) * 100 / 100)} ₺</td>
          <td className="h-[84px] bg-[#FFFFFF] border border-[E7E7E8] px-3 py-1">{Math.round(state.reduce((accumulator, currentValue) => accumulator + currentValue.ctr, 0) * 100 / 100)} ₺</td>
          <td className="h-[84px] bg-[#FFFFFF] border border-[E7E7E8] px-3 py-1">{Math.round(state.reduce((accumulator, currentValue) => accumulator + currentValue.impressions, 0) * 100 / 100)} ₺</td>
          <td className="h-[84px] bg-[#FFFFFF] border border-[E7E7E8] px-3 py-1">{Math.round(state.reduce((accumulator, currentValue) => accumulator + currentValue.reach, 0) * 100 / 100)} ₺</td>
          <td className="h-[84px] bg-[#FFFFFF] border border-[E7E7E8] px-3 py-1">{Math.round(state.reduce((accumulator, currentValue) => accumulator + currentValue.spend, 0) * 100 / 100)} ₺</td>
        </>}
      />
    </DragDropContext>
  );
}
