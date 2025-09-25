import Image from "next/image";
import DataTable from "../components/dataTable";
import Pagination from "../components/pagination";

export default function Home() {
  return (
    <div className="w-[500px]">
      <DataTable />
      <Pagination />
    </div>
  );
}
