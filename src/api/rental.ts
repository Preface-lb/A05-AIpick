import request from '@/utils/request';

// 定义租用记录的接口
interface RentalRecordResponse {
    code: number;
    message: string | null;
    data: {
        records: Array<{
            id: number;
            date: string;
            resourceType: string;
            resourceName: string;
            timePeriod: string;
            purpose: string;
            status: string;
        }>;
    };
}

// 获取租用记录
export const getRentalRecords = (): Promise<RentalRecordResponse['data']['records']> => {
    // 在开发环境中使用模拟数据
    if (process.env.NODE_ENV === 'development') {
        // 这里可以使用模拟数据，例如：
        const mockData = {
            records: [
                {
                    id: 1,
                    date: '2025-03-04',
                    resourceType: '教室',
                    resourceName: 'C303',
                    timePeriod: '9:00-18:00',
                    purpose: '上课',
                    status: '进行中',
                },
                {
                    id: 2,
                    date: '2025-03-04',
                    resourceType: '教室',
                    resourceName: 'C304',
                    timePeriod: '9:00-18:00',
                    purpose: '会议',
                    status: '已完成',
                },
            ],
        };

        return Promise.resolve(mockData.records);
    } else {
        // 在生产环境中使用真实 API
        return request({
            url: '/rental/records',
            method: 'get',
        }) as Promise<RentalRecordResponse['data']['records']>;
    }
};