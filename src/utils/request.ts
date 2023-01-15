export const request = async (url: string, options: RequestInit) => {
  // sleep 1s
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await fetch(url, options);
  const data = await res.json();
  if (data.code == 0) {
    return data.data;
  }
  throw new Error(data.msg || data.message);
};

// 将上面的代码封装成返回[data,error]的函数
export const useRequest = async <T>(
  url: string,
  options: RequestInit
): Promise<[T, null] | [null, any]> => {
  try {
    const data = await request(url, options);
    return [data, null];
  } catch (error) {
    return [null, error];
  }
};
