import { useEffect, useState } from 'react';

interface TableProps {
  fields: string[];
  items: string[];
  onDetailsClick: string[];
  onDeleteClick: (index: number) => void;
}

const Table = ({ fields, items, onDetailsClick, onDeleteClick }: TableProps) => {
  const [numCols, setNumCols] = useState(fields.length);

  useEffect(() => {
    setNumCols(fields.length);
  }, [fields]);
  
  const gridTemplateColumns = `repeat(${numCols}, 1fr)`;

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col">
        <div className={`grid rounded-sm bg-gray-2 dark:bg-meta-4`} style={{ gridTemplateColumns }}>
          {fields.map((value, key) => {

            return (
              <div key={key} className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  {value}
                </h5>
              </div>
            )
          })}
        </div>

        {items.map((item, rowIndex) => {
          return (
            <div
              className={`grid ${rowIndex === items.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
                }`} style={{ gridTemplateColumns }} 
              key={rowIndex}
            >
              {fields.map((field, colIndex) => {
                { colIndex }
                if (field === "ações") {
                  return (
                    <div key={colIndex} className="p-2.5">
                      <button onClick={() => onDetailsClick(item)} className="text-center w-full gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out bg-primary text-white lg:text-base">Detalhes</button>
                      <button onClick={() => onDeleteClick(item.id, item.product_type_id)} className="text-center w-full  gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out bg-danger text-white lg:text-base">Excluir</button>
                    </div>
                  );
                } else {
                  return (
                    <div key={colIndex} className="flex items-center gap-3 p-2.5 xl:p-5">
                      <p className="hidden text-black dark:text-white sm:block">{item[field]}</p>
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Table;