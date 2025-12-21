import axios, { type AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface SignupRequest {
  username: string
  password: string
}

interface SigninRequest {
  username: string
  password: string
}

interface AuthResponse {
  id: string
  token?: string
}

interface CreateWorkflowRequest {
  nodes: any[]
  edges: any[]
}

interface UpdateWorkflowRequest {
  nodes?: any[]
  edges?: any[]
}

interface WorkflowResponse {
  _id: string
}

interface Workflow {
  _id: string
  userId: string
  nodes: any[]
  edges: any[]
  createdAt?: string
  updatedAt?: string
}

interface Execution {
  _id: string
  workflowId: string
  status: string
  createdAt?: string
  updatedAt?: string
}

interface Node {
  _id: string
  name: string
  type: string
  metadata: any
}

class ApiClient {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor to include token
    this.axiosInstance.interceptors.request.use((config) => {
      const token = this.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || error.message || 'Request failed'
        throw new Error(message)
      }
    )
  }

  setToken(token: string) {
    localStorage.setItem('token', token)
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  clearToken() {
    localStorage.removeItem('token')
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/signup', data)
    return response.data
  }

  async signin(data: SigninRequest): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/signin', data)
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response.data
  }

  async createWorkflow(data: CreateWorkflowRequest): Promise<WorkflowResponse> {
    const response = await this.axiosInstance.post<WorkflowResponse>('/workflow', data)
    return response.data
  }

  async updateWorkflow(
    workflowId: string,
    data: UpdateWorkflowRequest
  ): Promise<WorkflowResponse> {
    const response = await this.axiosInstance.put<WorkflowResponse>(`/workflow/${workflowId}`, data)
    return response.data
  }

  async getWorkflow(workflowId: string): Promise<Workflow> {
    const response = await this.axiosInstance.get<Workflow>(`/workflow/${workflowId}`)
    return response.data
  }

  async getWorkflows(): Promise<Workflow[]> {
    const response = await this.axiosInstance.get<Workflow[]>('/workflows')
    return response.data
  }

  async getWorkflowExecutions(workflowId: string): Promise<Execution[]> {
    const response = await this.axiosInstance.get<Execution[]>(`/workflow/executions/${workflowId}`)
    return response.data
  }

  async getNodes(): Promise<Node[]> {
    const response = await this.axiosInstance.get<Node[]>('/nodes')
    return response.data
  }
}

export const apiClient = new ApiClient()
