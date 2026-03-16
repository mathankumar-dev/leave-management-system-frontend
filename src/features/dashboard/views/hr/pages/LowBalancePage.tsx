import { useEffect as useEff, useState as useSt, useRef, type SetStateAction, } from "react";
import { dashboardService } from "../../../services/dashboardService";
import type { LowBalanceEmployee } from "../../types";
import { LowBalanceTable } from "../components/Lowbalancetable";

// import { set } from "react-datepicker/dist/dist/date_utils.js";

function LowBalancePage() {
  const [data, setData] = useSt<LowBalanceEmployee[]>([]);
  const [loading, setLoading] = useSt(true);
  const [error, setError] = useSt<string | null>(null);
  const isMounted = useRef(false);

  useEff(() => {
    isMounted.current = true;

    const timer = setTimeout(() => {        // ← 100ms delay
      if (!isMounted.current) return;
      
      dashboardService.getLowBalanceEmployees()  // signal illama
        .then((res: SetStateAction<LowBalanceEmployee[]>) => {
          if (isMounted.current) { setData(res); setLoading(false); }
        })
        .catch((err: { message: SetStateAction<string | null>; }) => {
          if (isMounted.current) {
            setError(err instanceof Error ? err.message : 'Failed to load');
            setLoading(false);
          }
        });
    }, 100);

    return () => {
      isMounted.current = false;
      clearTimeout(timer);               // ← timer cancel
    };
  }, []);

  return <LowBalanceTable data={data} loading={loading} error={error} />;
};


export default LowBalancePage;