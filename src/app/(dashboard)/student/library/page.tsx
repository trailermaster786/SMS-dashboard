'use client'

import { useMemo, useState } from 'react'
import {
  BookOpen,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  DollarSign,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { libraryBooks, libraryIssues, students } from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'

export default function LibraryPage() {
  const { user } = useAuthStore()
  const student = students.find((s) => s.id === user?.id) || students[0]
  const CURRENT_STUDENT_ID = student.id
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState<string | null>(null)
  const [reserveDialogOpen, setReserveDialogOpen] = useState(false)

  const borrowedBooks = useMemo(
    () =>
      libraryIssues.filter(
        (i) => i.userId === CURRENT_STUDENT_ID && i.status === 'issued'
      ),
    []
  )

  const overdueBooks = useMemo(
    () =>
      libraryIssues.filter(
        (i) =>
          i.userId === CURRENT_STUDENT_ID &&
          i.status === 'overdue'
      ),
    []
  )

  const totalFines = useMemo(
    () => overdueBooks.reduce((sum, i) => sum + (i.fine || 0), 0),
    [overdueBooks]
  )

  const nowTimestamp = useMemo(() => Date.now(), [])

  const borrowedBooksWithDaysLeft = useMemo(() => {
    return borrowedBooks.map((issue) => {
      const book = libraryBooks.find((b) => b.id === issue.bookId)
      const dueDate = new Date(issue.dueDate)
      const daysLeft = Math.ceil(
        (dueDate.getTime() - nowTimestamp) / (1000 * 60 * 60 * 24)
      )
      return { issue, book, dueDate, daysLeft }
    })
  }, [borrowedBooks, nowTimestamp])

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return libraryBooks
    const q = searchQuery.toLowerCase()
    return libraryBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const getBook = (bookId: string) => libraryBooks.find((b) => b.id === bookId)

  const selectedBookData = selectedBook ? libraryBooks.find((b) => b.id === selectedBook) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Library</h1>
        <p className="text-muted-foreground">
          Browse the catalog and manage your borrowed books.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Books Borrowed
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{borrowedBooks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue Books
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {overdueBooks.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding Fines
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFines}</div>
          </CardContent>
        </Card>
      </div>

      {borrowedBooks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Currently Borrowed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Days Left</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowedBooksWithDaysLeft.map(({ issue, book, dueDate, daysLeft }) => {
                  return (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{book?.title || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">
                            {book?.author || ''}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(issue.issueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {dueDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={daysLeft <= 3 ? 'destructive' : 'default'}
                        >
                          {daysLeft <= 0 ? 'Overdue' : `${daysLeft} days`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Progress
                          value={Math.max(0, Math.min(100, ((14 - daysLeft) / 14) * 100))}
                          className="h-2 w-20"
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {totalFines > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Outstanding Fines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueBooks.map((issue) => {
                const book = getBook(issue.bookId)
                return (
                  <div
                    key={issue.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{book?.title || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">
                            Due: {new Date(issue.dueDate).toLocaleDateString()}
                          </p>
                    </div>
                    <Badge variant="destructive">${issue.fine}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Book Catalog
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredBooks.length} books
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">No books found</p>
              <p className="text-sm text-muted-foreground">
                Try a different search query.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="flex flex-col">
                  <CardContent className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h3 className="font-semibold leading-tight">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                      </div>
                      <Badge
                        variant={
                          book.status === 'available'
                            ? 'success'
                            : book.status === 'limited'
                            ? 'warning'
                            : 'destructive'
                        }
                      >
                        {book.status === 'available'
                          ? 'Available'
                          : book.status === 'limited'
                          ? 'Limited'
                          : 'Unavailable'}
                      </Badge>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                      <p>Category: {book.category}</p>
                      <p>ISBN: {book.isbn}</p>
                      <p>Shelf: {book.shelfLocation}</p>
                      <p>
                        Copies: {book.availableCopies} / {book.totalCopies}
                      </p>
                    </div>
                    <div className="mt-auto pt-3">
                      <Button
                        className="w-full"
                        variant={book.status === 'unavailable' ? 'outline' : 'default'}
                        disabled={book.status === 'unavailable'}
                        onClick={() => {
                          setSelectedBook(book.id)
                          setReserveDialogOpen(true)
                        }}
                      >
                        {book.status === 'unavailable' ? 'Unavailable' : 'Reserve'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={reserveDialogOpen} onOpenChange={setReserveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserve Book</DialogTitle>
            <DialogDescription>
              You are about to reserve this book from the library.
            </DialogDescription>
          </DialogHeader>
          {selectedBookData && (
            <div className="space-y-3">
              <div className="rounded-lg border p-4">
                <p className="font-semibold">{selectedBookData.title}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedBookData.author}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{selectedBookData.category}</span>
                  <span className="text-muted-foreground">Location:</span>
                  <span>{selectedBookData.shelfLocation}</span>
                  <span className="text-muted-foreground">Available:</span>
                  <span>{selectedBookData.availableCopies} copies</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                You will receive a notification when the book is ready for pickup.
                Books must be returned within 14 days of issue.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReserveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setReserveDialogOpen(false)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
