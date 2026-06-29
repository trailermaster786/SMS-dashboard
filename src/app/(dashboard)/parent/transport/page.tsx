'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  User,
  Route,
  CircleDot,
  Zap,
} from 'lucide-react';
import { students, transports, routes } from '@/lib/mock-data';
import { useAuthStore } from '@/store/auth-store';

export default function ParentTransportPage() {
  const { user } = useAuthStore()
  const parentChildren = students.filter(
    (s) => s.parentId === user?.id
  );
  const [selectedChildId, setSelectedChildId] = useState(parentChildren[0]?.id || '');

  const selectedChild = students.find((s) => s.id === selectedChildId);
  const childTransport = transports.find((t) => t.status === 'active');
  const childRoute = childTransport ? routes.find((r) => r.id === childTransport.routeId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transport Tracking</h1>
          <p className="text-muted-foreground">View your child&apos;s transport details</p>
        </div>
        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            {parentChildren.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {childTransport && childRoute ? (
        <>
          <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Zap className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">Live Status: On Route</h2>
              <p className="text-sm text-muted-foreground">
                Bus is currently on schedule | ETA: 8 minutes
              </p>
            </div>
            <Badge variant="success" className="animate-pulse">
              <span className="mr-1 h-2 w-2 rounded-full bg-white" />
              Live
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Route Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Bus className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-lg font-bold">{childRoute.name}</h3>
                      <p className="text-sm text-muted-foreground">Route ID: {childRoute.id}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                        <CircleDot className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Start Point</p>
                        <p className="text-sm font-medium">{childRoute.startPoint}</p>
                      </div>
                    </div>
                    <div className="ml-4 border-l-2 border-dashed border-muted py-1 pl-6">
                      {childRoute.stops.map((stop, idx) => (
                        <div key={idx} className="relative py-1">
                          <div className="absolute -left-[29px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-muted" />
                          <p className="text-sm text-muted-foreground">{stop}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                        <MapPin className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">End Point</p>
                        <p className="text-sm font-medium">{childRoute.endPoint}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bus & Driver Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Bus className="h-4 w-4" />
                        <span className="text-xs">Bus Number</span>
                      </div>
                      <p className="mt-1 font-semibold">{childTransport.vehicleNumber}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Route className="h-4 w-4" />
                        <span className="text-xs">Vehicle Type</span>
                      </div>
                      <p className="mt-1 font-semibold capitalize">{childTransport.vehicleType}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="text-xs">Driver Name</span>
                      </div>
                      <p className="mt-1 font-semibold">{childTransport.driverName}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="text-xs">Driver Phone</span>
                      </div>
                      <p className="mt-1 font-semibold">{childTransport.driverPhone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs">Pickup Time</span>
                      </div>
                      <p className="mt-1 text-lg font-bold">7:15 AM</p>
                      <p className="text-xs text-muted-foreground">Elm Street</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs">Drop-off Time</span>
                      </div>
                      <p className="mt-1 text-lg font-bold">3:45 PM</p>
                      <p className="text-xs text-muted-foreground">Elm Street</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="mt-1 font-semibold">{childRoute.distance} km</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Est. Travel Time</p>
                      <p className="mt-1 font-semibold">{childRoute.estimatedTime} min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" size="lg">
                <Phone className="mr-2 h-4 w-4" />
                Contact Driver
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Bus className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-medium">No Transport Assigned</h3>
            <p className="text-sm text-muted-foreground">
              Your child does not have transport assigned yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
